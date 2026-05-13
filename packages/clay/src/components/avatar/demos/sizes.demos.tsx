import {
  Avatar,
  AvatarFallback,
} from '@brika/clay/components/avatar';
/** Three preset sizes, `sm` (24px), `default` (32px), and `lg` (40px). */
export default function AvatarSizesDemo() {
  return (
    <div className="flex items-center gap-3">
      <Avatar size="sm">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar size="default">
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
    </div>
  );
}
