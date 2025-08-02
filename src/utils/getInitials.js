const getInitials = (name = "") => {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .join("")
    .slice(0, 2); // In case of longer names like "John A Doe"
};

export default getInitials;
