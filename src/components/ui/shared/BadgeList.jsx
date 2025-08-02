const BadgeList = ({ product }) => {
  return (
    <div className="absolute top-2 left-2 flex flex-col space-y-1">
      {product.isNew && (
        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
          NEW
        </span>
      )}
      {product.isBestseller && (
        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
          BESTSELLER
        </span>
      )}
      {product.discount > 0 && (
        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
          {product.discount}% OFF
        </span>
      )}
    </div>
  );
};

export default BadgeList;
