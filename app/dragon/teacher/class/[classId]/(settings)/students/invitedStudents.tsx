import { db } from "@/app/dragon/teacher/routers";
import { typeGetInviteList } from "@/app/dragon/teacher/routers/inviteStudentsRouter";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Avvvatars from "avvvatars-react";

export const InvitedSudents = async ({
  inviteList,
}: {
  inviteList: typeGetInviteList["inviteList"];
}) => {
  return (
    <div className="max-h-[300px] overflow-y-scroll custom-scrollbar">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[100px] text-text-300">S.No.</TableHead>
            <TableHead></TableHead>
            <TableHead className="text-text-300">Email</TableHead>
            <TableHead className="text-text-300">Status</TableHead>
            <TableHead className="text-text-300">
              Expires In <span className="text-[9px]">(Days)</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inviteList && (
            <>
              {inviteList.length > 0 && (
                <>
                  {inviteList.map((invite, index) => {
                    return (
                      <TableRow
                        key={invite.id}
                        className="hover:bg-transparent"
                      >
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="p-2 w-fit rounded-full border border-slate-500">
                            <Avvvatars
                              value={invite.id}
                              style="shape"
                              size={30}
                            />
                          </div>
                        </TableCell>
                        <TableCell>{invite.studentEmail}</TableCell>
                        <TableCell>{invite.status}</TableCell>
                        <TableCell>{invite.daysUntilExpiry}</TableCell>
                      </TableRow>
                    );
                  })}
                </>
              )}
            </>
          )}
        </TableBody>
      </Table>
      {!inviteList && (
        <div className="flex justify-center items-center w-full h-[100px]">
          <p className="text-text-200">
            Can&apos;t load invited students right now. Try again later...
          </p>
        </div>
      )}
      {inviteList?.length === 0 && (
        <div className="flex justify-center items-center w-full h-[100px]">
          <p className="text-text-200">No Students have been invited.</p>
        </div>
      )}
    </div>
  );
};
