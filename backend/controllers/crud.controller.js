const create = (Model) => async (req, res) => {
  try {
    const result = await Model.create(req.body);
    res
      .status(201)
      .json({ result: result, message: "Item has added successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getAll = (Model) => async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit =
      req.query.limit == "ALL" ? null : parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const queryObj = {};

    if (search) {
      queryObj.$or = [
        {
          ProductType: {
            $regex: search,
            $options: "i",
          },
        },
        {
          Description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }
    let query = Model.find(queryObj);

    // const total_record = await query.countDocuments();

    if (limit) {
      query = query.limit(limit);
    }

    const result = await query.skip(skip).sort({ createdAt: -1 });
    const total_record = await Model.countDocuments(queryObj);
    const total_page = limit
      ? Math.max(1, Math.ceil(total_record / limit))
      : 1;

    res.status(200).json({
      data: result,
      total_record: total_record,
      total_page: total_page,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getById = (Model) => async (req, res) => {
  try {
    const result = await Model.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Not Found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const update = (Model) => async (req, res) => {
  try {
    const result = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!result) {
      return res.status(404).json({ message: "Not Found" });
    }
    res.status(200).json({ message: "Item has updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const remove = (Model) => async (req, res) => {
  try {
    const result = await Model.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Not Found" });
    }
    return res
      .status(200)
      .json({ message: "Item has beed deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};
