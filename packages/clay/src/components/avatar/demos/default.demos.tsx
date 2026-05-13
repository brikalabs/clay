import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@brika/clay/components/avatar';
/** Default avatar with a remote image and initials fallback. */
export default function AvatarDefaultDemo() {
  return (
    <Avatar>
      <AvatarImage src="https://api.dicebear.com/9.x/initials/svg?seed=Alicia" alt="Alicia Reyes" />
      <AvatarFallback>AR</AvatarFallback>
    </Avatar>
  );
}
