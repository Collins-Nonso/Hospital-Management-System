const generateId = (prefix) => {
  const randomNumber = Math.floor(
    100000 + Math.random() * 900000
  );

  const year = new Date().getFullYear().toString().slice(-2);
  const month = (new Date().getMonth() + 1).toString().padStart(2, "0");
  const day = new Date().getDate().toString().padStart(2, "0");
  const hours = new Date().getHours().toString().padStart(2, "0");
  const minutes = new Date().getMinutes().toString().padStart(2, "0");
  const seconds = new Date().getSeconds().toString().padStart(2, "0");

  const datePart = `${year}${month}${day}`;
  const timePart = `${hours}${minutes}${seconds}`;

  return `${prefix}-${datePart}${timePart}${randomNumber}`;
};

module.exports = generateId;