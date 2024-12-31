import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, ExternalLink, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface UserCardProps {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  pronouns: string;
  avatarUrl?: string;
  createdAt?: string;
  uri: string | null;
}

export function UserCard({
  fullName,
  companyName,
  email,
  phone,
  pronouns,
  avatarUrl,
  uri,
  createdAt,
}: UserCardProps) {
  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex flex-row items-center gap-4 p-2 px-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={avatarUrl} alt={fullName} />
          {/* Random background */}
          <AvatarFallback style={{ backgroundColor: "hsl(0, 0%, 90%)" }}>
            {fullName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex justify-between w-full">
          <div>
            <CardTitle className="text-xl">{fullName}</CardTitle>
            <div className="flex gap-2">
              <p className="text-sm text-muted-foreground">{pronouns}</p> •
              <p className="text-sm text-muted-foreground">
                {createdAt
                  ? formatDistanceToNow(new Date(createdAt), {
                      addSuffix: true,
                    })
                  : ""}
              </p>
            </div>
          </div>
          {uri && (
            <div>
              <Link href={uri} target="_blank" className="hover:text-primary">
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </Link>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="gap-4">
        <div className="flex gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <span>{companyName || "----"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <a
              href={`mailto:${email}`}
              className="text-primary hover:underline"
            >
              {email}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <a href={`tel:${phone}`} className="text-primary hover:underline">
              {phone}
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
