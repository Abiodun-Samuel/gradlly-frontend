"use client";

import { AlertCircle, Camera, CheckCircle, Loader2, User } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const AVATAR_SIZES = {
  xs: {
    container: "w-6 h-6",
    text: "text-[10px]",
    icon: 10,
    badge: "w-3 h-3",
    badgeIcon: 8,
  },
  sm: {
    container: "w-8 h-8",
    text: "text-xs",
    icon: 14,
    badge: "w-3.5 h-3.5",
    badgeIcon: 10,
  },
  md: {
    container: "w-10 h-10",
    text: "text-sm",
    icon: 16,
    badge: "w-4 h-4",
    badgeIcon: 12,
  },
  lg: {
    container: "w-12 h-12",
    text: "text-base",
    icon: 18,
    badge: "w-5 h-5",
    badgeIcon: 14,
  },
  xl: {
    container: "w-16 h-16",
    text: "text-lg",
    icon: 22,
    badge: "w-6 h-6",
    badgeIcon: 16,
  },
  "2xl": {
    container: "w-20 h-20",
    text: "text-xl",
    icon: 26,
    badge: "w-7 h-7",
    badgeIcon: 18,
  },
  "3xl": {
    container: "w-28 h-28",
    text: "text-2xl",
    icon: 32,
    badge: "w-8 h-8",
    badgeIcon: 20,
  },
};

const SHAPE_CLASSES = { circle: "rounded-full", square: "rounded-xl" };

// next/image is only configured for our own host; render anything else (e.g.
// presigned S3 URLs) with a plain <img> so we never trip the remotePatterns
// guard. Data-URL previews also use the plain <img> path.
function isOptimizableUrl(src) {
  if (typeof src !== "string") return false;
  if (src.startsWith("data:") || src.startsWith("blob:")) return false;
  try {
    return new URL(src).hostname.endsWith(".gradlly.com");
  } catch {
    return false; // relative/unknown → plain <img>
  }
}

/**
 * Avatar
 *
 * Displays a user/organisation image with graceful initials fallback. Supports
 * an OPTIONAL upload affordance that works in two interchangeable modes:
 *
 *  • Self-contained async (recommended): pass `uploadable` + `onFileSelect`.
 *    The component shows an optimistic preview of the chosen file, overlays a
 *    spinner while `onFileSelect(file)` resolves, and reverts the preview
 *    automatically if it rejects.
 *
 *  • Legacy data-URL: pass `onUpload(dataUrl)`. The component reads the file as
 *    a data URL and hands it back — caller owns persistence. (Unchanged.)
 *
 * When no upload handler is supplied, the avatar is purely presentational.
 */
export function Avatar({
  src,
  alt = "User avatar",
  initials = "",
  size = "md",
  shape = "circle",
  // legacy data-URL upload (kept for backward compatibility)
  onUpload,
  // self-contained async upload
  uploadable = false,
  onFileSelect,
  accept = "image/png,image/jpeg,image/webp,image/gif,image/svg+xml",
  // shared
  onError,
  className = "",
  loading = false,
  disabled = false,
  isProfileCompleted = false,
  showProfileStatus = false,
}) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [preview, setPreview] = useState(null); // object URL during async upload
  const [internalUploading, setInternalUploading] = useState(false);
  const [lastSrc, setLastSrc] = useState(src);
  const fileInputRef = useRef(null);

  // When the persisted `src` genuinely changes, reset the error flag and drop
  // any optimistic preview so the canonical image takes over without a flash.
  // Done during render (React's recommended pattern) rather than in an effect,
  // so there is no extra commit/paint with stale state.
  if (src !== lastSrc) {
    setLastSrc(src);
    setImageError(false);
    setPreview(null);
  }

  const sizeConfig = AVATAR_SIZES[size] ?? AVATAR_SIZES.md;
  const shapeClass = SHAPE_CLASSES[shape] ?? SHAPE_CLASSES.circle;

  const isUploadable =
    !disabled && (Boolean(onUpload) || (uploadable && Boolean(onFileSelect)));
  const isBusy = loading || internalUploading;

  // The displayed source: optimistic preview wins while uploading, otherwise
  // the persisted src.
  const displaySrc = preview ?? src;
  const showImage = Boolean(displaySrc) && !imageError;
  const useNextImage = isOptimizableUrl(displaySrc);

  const displayInitials = useMemo(
    () => (initials ? initials.slice(0, 2).toUpperCase() : ""),
    [initials],
  );

  // Revoke object URLs to avoid leaks.
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageError = useCallback(() => {
    setImageError(true);
    onError?.("Failed to load image");
  }, [onError]);

  const handleClick = useCallback(() => {
    if (isUploadable && !isBusy) fileInputRef.current?.click();
  }, [isUploadable, isBusy]);

  const clearInput = useCallback(() => {
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleFileChange = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      clearInput();
      if (!file) return;

      // ── Self-contained async mode ──────────────────────────────────────
      if (uploadable && onFileSelect) {
        setPreview(URL.createObjectURL(file));
        setImageError(false);
        setInternalUploading(true);
        try {
          await onFileSelect(file);
          // On success keep the preview until the parent's updated `src` lands —
          // the render-time reset above swaps it in seamlessly (no flash). The
          // object URL is revoked by the cleanup effect when `preview` changes.
        } catch {
          // Parent/hook already surfaces the error toast; revert to old src.
          setPreview(null);
        } finally {
          setInternalUploading(false);
        }
        return;
      }

      // ── Legacy data-URL mode ───────────────────────────────────────────
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload?.(reader.result);
        setImageError(false);
      };
      reader.onerror = () => onError?.("Failed to read file");
      reader.readAsDataURL(file);
    },
    [uploadable, onFileSelect, onUpload, onError, clearInput],
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (isUploadable && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        handleClick();
      }
    },
    [isUploadable, handleClick],
  );

  const containerClass = [
    "relative overflow-hidden transition-all duration-300",
    sizeConfig.container,
    shapeClass,
    isUploadable && !isBusy ? "cursor-pointer" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const badgeClass = [
    "absolute -bottom-0.5 -right-0.5 flex items-center justify-center ring-2 ring-white transition-all duration-200",
    sizeConfig.badge,
    isProfileCompleted
      ? "bg-linear-to-br from-green-500 to-emerald-600"
      : "bg-linear-to-br from-red-500 to-rose-600",
    shape === "circle" ? "rounded-full" : "rounded-lg",
  ].join(" ");

  return (
    <div className="relative inline-block shrink-0">
      <div
        className={containerClass}
        onClick={handleClick}
        onMouseEnter={() => isUploadable && setIsHovered(true)}
        onMouseLeave={() => isUploadable && setIsHovered(false)}
        onKeyDown={handleKeyDown}
        role={isUploadable ? "button" : undefined}
        aria-label={isUploadable ? "Upload image" : alt}
        aria-busy={isBusy || undefined}
        tabIndex={isUploadable && !isBusy ? 0 : undefined}
      >
        {showImage ? (
          useNextImage ? (
            <Image
              src={displaySrc}
              alt={alt}
              fill
              sizes="128px"
              className="object-cover"
              onError={handleImageError}
              draggable={false}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displaySrc}
              alt={alt}
              className="h-full w-full object-cover"
              onError={handleImageError}
              draggable={false}
            />
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary-500 to-primary-700">
            {displayInitials ? (
              <span
                className={`select-none font-bold text-white ${sizeConfig.text}`}
              >
                {displayInitials}
              </span>
            ) : (
              <User size={sizeConfig.icon} className="text-white/80" />
            )}
          </div>
        )}

        {isUploadable && (
          <>
            <div
              className={[
                "absolute inset-0 flex items-center justify-center bg-black/55 transition-opacity duration-200",
                isHovered && !isBusy ? "opacity-100" : "opacity-0",
              ].join(" ")}
              aria-hidden
            >
              <Camera
                size={Math.round(sizeConfig.icon * 0.8)}
                className="text-white drop-shadow"
              />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
              aria-label="Upload image file"
              disabled={isBusy}
            />
          </>
        )}

        {isBusy && (
          <div
            className={`absolute inset-0 flex items-center justify-center bg-black/55 ${shapeClass}`}
          >
            <Loader2 size={20} className="animate-spin text-white" />
          </div>
        )}
      </div>

      {showProfileStatus && (
        <div
          className={badgeClass}
          aria-label={
            isProfileCompleted ? "Profile complete" : "Profile incomplete"
          }
          title={
            isProfileCompleted ? "Profile complete" : "Complete your profile"
          }
        >
          {isProfileCompleted ? (
            <CheckCircle size={sizeConfig.badgeIcon} className="text-white" />
          ) : (
            <AlertCircle
              size={sizeConfig.badgeIcon}
              className="animate-pulse text-white"
            />
          )}
        </div>
      )}
    </div>
  );
}
