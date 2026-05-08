import GoogleIcon from "@/assets/icons/index";

export default function SocialButtons() {
  return (
    <div className="space-y-3">
      <button className="w-full border rounded-lg py-2.5 font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
        <GoogleIcon className="w-5 h-5" />
        Continue with Google
      </button>
    </div>
  );
}
