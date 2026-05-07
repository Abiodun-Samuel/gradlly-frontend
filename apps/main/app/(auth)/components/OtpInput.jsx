export default function OtpInput() {
  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          maxLength={1}
          className="w-12 h-12 text-center border rounded-lg text-lg  outline-none"
        />
      ))}
    </div>
  );
}
