const Notification = ({ message, type }) => {
  if (message === null) return null;

  const style = {
    color: type === 'success' ? 'green' : 'red',
    background: '#ccc',
    fontSize: 18,
    borderStyle: 'solid',
    borderRadius: 6,
    borderColor:  type === 'success' ? 'green' : 'red',
    padding: 10,
    marginBottom: 10
  };

  return <div style={style}>{message}</div>;
};

export default Notification;
