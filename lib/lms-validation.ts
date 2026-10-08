export class LmsError extends Error {
  constructor(
    message: string,
    public status = 400,
    public code = "INVALID_REQUEST",
  ) {
    super(message);
  }
}

export function text(
  value: unknown,
  label: string,
  max = 160,
  required = true,
): string {
  if (typeof value !== "string") {
    if (!required && value == null) return "";
    throw new LmsError(`${label} is required.`);
  }
  const result = value.trim();
  if ((required && !result) || result.length > max)
    throw new LmsError(
      `${label} must be ${required ? "1–" : "at most "}${max} characters.`,
    );
  return result;
}
export function uuid(value: unknown, label = "ID") {
  if (
    typeof value !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      value,
    )
  )
    throw new LmsError(`Invalid ${label}.`);
  return value;
}
export function httpsUrl(value: unknown, required = true): string | null {
  const raw = text(value, "Link", 2000, required);
  if (!raw) return null;
  try {
    const parsed = new URL(raw);
    if (
      parsed.protocol !== "https:" ||
      !parsed.hostname ||
      parsed.username ||
      parsed.password
    )
      throw new Error();
    return parsed.href;
  } catch {
    throw new LmsError("Use a valid HTTPS link.");
  }
}
export function integer(
  value: unknown,
  label: string,
  min: number,
  max: number,
) {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < min ||
    value > max
  )
    throw new LmsError(`${label} must be between ${min} and ${max}.`);
  return value;
}
export function boolean(value: unknown) {
  if (typeof value !== "boolean")
    throw new LmsError("A true or false value is required.");
  return value;
}
export function timestamp(value: unknown, required = true): string | null {
  if (!required && (value === "" || value == null)) return null;
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(value) ||
    !Number.isFinite(Date.parse(value))
  )
    throw new LmsError("Choose a valid date and time.");
  return new Date(value).toISOString();
}

export function lessonEmbed(raw: string | null) {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") return null;
    let id = "";
    if (
      ["youtube.com", "www.youtube.com", "m.youtube.com"].includes(url.hostname)
    ) {
      id =
        url.pathname === "/watch"
          ? (url.searchParams.get("v") ?? "")
          : (url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)$/)?.[1] ?? "");
    } else if (url.hostname === "youtu.be") id = url.pathname.slice(1);
    if (/^[\w-]{11}$/.test(id))
      return `https://www.youtube-nocookie.com/embed/${id}`;
    if (
      ["vimeo.com", "www.vimeo.com"].includes(url.hostname) &&
      /^\/\d+$/.test(url.pathname)
    )
      return `https://player.vimeo.com/video/${url.pathname.slice(1)}`;
  } catch {
    /* Other providers are opened using the original validated HTTPS link. */
  }
  return null;
}
