import Avatar from "@/components/avatar";
import Link from "next/link";
import SignOutButton from "@/components/auth/sign-out-btn";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";

interface Props {
  url: string;
}

export default function ProfileDropDown({ url }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar />
      </DropdownMenuTrigger>
      <DropdownMenuContent
      >
        <DropdownMenuItem>
          <Link href={url}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
