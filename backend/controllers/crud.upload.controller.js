const { randomUUID } = require("crypto");
const fs = require("fs");
const path = require("path");

// Use Node's built-in fetch for Cloudinary when configured
const cloudinaryRequest = async (action, data) => {
  if (!process.env.CLOUDINARY_URL) throw new Error("Set CLOUDINARY_URL in the backend environment");
  const config = new URL(process.env.CLOUDINARY_URL);
  const credentials = `${decodeURIComponent(config.username)}:${decodeURIComponent(config.password)}`;
  const response = await fetch(`https://api.cloudinary.com/v1_1/${config.hostname}/image/${action}`, {
    method: "POST",
    headers: { Authorization: `Basic ${Buffer.from(credentials).toString("base64")}` },
    body: new URLSearchParams(data),
  });
  if (!response.ok) throw new Error("Cloudinary request failed. Please try again.");
  return response.json();
};

const uploadImage = async (file) => {
  if (process.env.CLOUDINARY_URL) {
    const publicId = `pos-${randomUUID()}`;
    await cloudinaryRequest("upload", {
      file: `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
      public_id: publicId,
      allowed_formats: "jpg,png",
    });
    return `cloudinary-${publicId}`;
  } else {
    // Local disk storage fallback
    const uploadsDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const ext = file.originalname ? path.extname(file.originalname) : ".png";
    const filename = `${Date.now()}-${randomUUID()}${ext}`;
    fs.writeFileSync(path.join(uploadsDir, filename), file.buffer);
    return filename;
  }
};

const deleteImage = async (picture) => {
  if (!picture || picture === "image.png") return;
  if (/^cloudinary-pos-[a-f0-9-]{36}$/.test(picture)) {
    try {
      await cloudinaryRequest("destroy", { public_id: picture.slice(11), invalidate: "true" });
    } catch {
      console.error("Could not delete Cloudinary image:", picture);
    }
  } else {
    try {
      const filePath = path.join(__dirname, "../uploads", picture);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error("Could not delete local image:", picture, err);
    }
  }
};

const listAll =
  (Model, searchableField = []) =>
    async (req, res) => {
      try {
        const search = req.query.search || "";
        const page = parseInt(req.query.page) || 1;
        const limit =
          req.query.limit == "ALL" ? null : parseInt(req.query.limit) || 15;
        const skip = (page - 1) * (limit || 0);

        const queryObj = {};

        if (search && searchableField.length > 0) {
          queryObj.$or = searchableField.map((field) => ({
            [field]: {
              $regex: search,
              $options: "i",
            },
          }));
        }
        let query = Model.find(queryObj);

        if (limit) {
          query = query.limit(limit);
        }

        const result = await query.skip(skip).sort({ createdAt: -1 }).populate('ProductType', 'ProductType');
        const total_record = await Model.find(queryObj).countDocuments();
        const total_page = limit ? Math.ceil(total_record / limit) : 1;

        return res.status(200).json({
          data: result,
          total: result.length,
          total_record: total_record,
          total_page: total_page || 1,
        });
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    };

const getOne = (Model) => async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Model.findOne({ _id: id });
    if (!result) {
      return res.status(404).json({
        message: "Record is not found",
      });
    }
    return res.status(200).json({ data: result });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const create = (Model, uploadField) => async (req, res) => {
  let uploaded;
  try {
    const data = { ...req.body };
    delete data[uploadField];
    if (req.file) {
      uploaded = await uploadImage(req.file);
      data[uploadField] = uploaded;
    }
    
    if (!data.ProductType || data.ProductType === "None" || data.ProductType === "") {
      return res.status(400).json({ message: "សូមជ្រើសរើសប្រភេទទំនិញ (Product Type is required)" });
    }

    const result = await Model.create(data);
    return res.status(201).json({ data: result, message: "Item has been added" });
  } catch (error) {
    if (uploaded) await deleteImage(uploaded);
    return res.status(error.status || 400).json({ message: error.message || "Failed to add item" });
  }
};

const removeAll = (Model) => async (req, res) => {
  try {
    await Model.deleteMany({});
    return res.status(200).json({ message: "all records deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const remove = (Model, uploadField) => async (req, res) => {
  try {
    const result = await Model.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Product Not Found" });
    if (result[uploadField]) await deleteImage(result[uploadField]);
    return res.status(200).json({ message: "Deleted" });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message });
  }
};

const update = (Model, uploadField) => async (req, res) => {
  let uploaded;
  try {
    const result = await Model.findById(req.params.id);
    if (!result) return res.status(404).json({ message: "record is not found" });
    const data = { ...req.body };
    delete data[uploadField];
    if (req.file) {
      uploaded = await uploadImage(req.file);
      data[uploadField] = uploaded;
    }
    if (data.ProductType === "None" || data.ProductType === "") {
      delete data.ProductType;
    }
    const updated = await Model.updateOne(
      { _id: result._id },
      { $set: data },
      { runValidators: true },
    );
    if (uploaded && result[uploadField]) await deleteImage(result[uploadField]);
    return res.status(200).json({ message: "updated" });
  } catch (error) {
    if (uploaded) await deleteImage(uploaded);
    return res.status(error.status || 400).json({ message: error.message });
  }
};

module.exports = {
  create,
  remove,
  removeAll,
  listAll,
  update,
  getOne,
};
