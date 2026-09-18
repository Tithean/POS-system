import { FiUsers } from "react-icons/fi";
function Card({ productName, image, description }) {
  return (
    <div className="card bg-base-100 w-96 shadow-sm">
      {/* <figure>
        <img src={image} alt={productName} />
      </figure> */}
      <div className="card-body">
        <h2 className="card-title">
          {productName} <FiUsers />
          <div className="badge badge-secondary">NEW</div>
        </h2>
        <p>{description}</p>
        <div className="card-actions justify-end">
          <div className="badge badge-outline">Fashion</div>
          <div className="badge badge-outline">Products</div>
        </div>
      </div>
    </div>
  );
}

export default Card;
