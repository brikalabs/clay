import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@brika/clay/components/avatar';
/** Stacked AvatarGroup with a count bubble for the remaining members. */
export default function AvatarGroupDemo() {
  return (
    <AvatarGroup>
      <Avatar>
        <AvatarImage src="https://api.dicebear.com/9.x/initials/svg?seed=Alicia" alt="Alicia" />
        <AvatarFallback>AR</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>TH</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>YT</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+4</AvatarGroupCount>
    </AvatarGroup>
  );
}
