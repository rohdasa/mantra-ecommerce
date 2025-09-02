const getInitials = (name = "") => {
  if (!name || typeof name !== "string") return "";
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .join("")
    .slice(0, 2); // In case of longer names like "John A Doe"
};

export default getInitials;
