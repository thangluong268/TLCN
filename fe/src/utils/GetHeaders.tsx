export default function GetHeaders() {
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')??"") : {}
    const authorization = `Bearer ${user?.stsTokenManager?.accessToken}`
    const headers = {
      'Authorization': authorization,
    };
    return headers
}
