export function formatMessageTime(date) {
  const options = { hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(date).toLocaleTimeString(
    "en-US",{hour:"2-digit", minute:"2-digit",hour12:false}
  );
}
