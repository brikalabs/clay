import {
  Avatar,
  AvatarFallback,
} from '@brika/clay/components/avatar';
/** When the image URL fails or is omitted, initials render in the fallback slot. */
export default function AvatarFallbackDemo() {
  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarFallback>TR</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>YT</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>DV</AvatarFallback>
      </Avatar>
    </div>
  );
}
