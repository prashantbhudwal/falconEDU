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
    <div className="custom-scrollbar max-h-[300px] overflow-y-scroll">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[100px] text-slate-300">S.No.</TableHead>
            <TableHead></TableHead>
            <TableHead className="text-slate-300">Email</TableHead>
            <TableHead className="text-slate-300">Status</TableHead>
            <TableHead className="text-slate-300">
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
                          <div className="w-fit rounded-full border border-slate-500 p-2">
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
        <div className="flex h-[100px] w-full items-center justify-center">
          <p className="text-slate-200">
            Can&apos;t load invited students right now. Try again later...
          </p>
        </div>
      )}
      {inviteList?.length === 0 && (
        <div className="flex h-[100px] w-full items-center justify-center">
          <p className="text-slate-200">No Students have been invited.</p>
        </div>
      )}
    </div>
  );
};
