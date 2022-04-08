export const shortenAddress = (address) => `${address.toString().slice(0, 5)}...${address.slice(address.length - 4)}`;
export const shortenBalance = (address) => `${address.toString().slice(0, 5)}`;