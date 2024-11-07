import { jwtDecode } from 'jwt-decode';

export function getUserIdFromToken() {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    try {
      const decoded: any = jwtDecode(token);  // Giải mã token
      return decoded.userId;  // Trả về userId từ token
    } catch (error) {
      console.error("Error decoding JWT token", error);
      return null;
    }
  }
  return null;
}
