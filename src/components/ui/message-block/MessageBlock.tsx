interface Props {
  title: string;
  message: string;
}

const MessageBlock = ({ title, message }: Props) => {
  return (
    <div className="bg-green-100 text-green-900 p-2 my-2 rounded-md flex gap-4 items-center">
      <div className="text-white bg-green-600 rounded-full flex justify-center items-center w-7 h-7 text-lg">
        ✓
      </div>
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export default MessageBlock;
