const getTime = () => {
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    return currentTime + " " + currentDate;
  };

export default getTime;