import { AddIcon, EditIcon } from "@/components/icons";
import { ChubbiLoading } from "@/components/loading/chubbi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/routers";
import { url } from "@/lib/urls";
import { cn } from "@/lib/utils";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Source } from "@prisma/client";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import Fuse from "fuse.js";
import Link from "next/link";
import { useMemo, useState } from "react";

export const ResourceDialog = ({
  open,
  setOpen,
  onSelect,
  classId,
  grade,
}: {
  onSelect: (content: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  classId: string;
  grade: string;
}) => {
  const [parent] = useAutoAnimate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResource, setSelectedResource] = useState<Source>();
  const { data: resources, isLoading } = useQuery({
    queryKey: ["", classId],
    queryFn: () =>
      db.source.queries.allByClassId({
        classId,
      }),
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
    refetchOnMount: true,
  });

  const fuse = useMemo(() => {
    return new Fuse(resources ?? [], {
      keys: ["title", "description", "content"],
    });
  }, [resources]);

  const results = fuse.search(searchTerm);

  const searchResults = searchTerm
    ? results.map((result) => result.item)
    : resources;

  const noResourcesInClass = !isLoading && !resources?.length;
  if (noResourcesInClass) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex h-5/6 max-w-5xl flex-col place-content-center space-y-3">
          <AddResource classId={classId} />
        </DialogContent>
      </Dialog>
    );
  }

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex h-5/6 max-w-5xl flex-col items-center justify-center space-y-3">
          <ChubbiLoading />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex h-5/6 max-w-5xl flex-col space-y-3">
        <DialogHeader>
          <DialogTitle>Resource</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search resources..."
          />
        </DialogDescription>
        <div className="flex h-5/6 flex-grow space-x-2">
          <div
            className="scrollbar-sm flex w-1/3 flex-col items-center space-y-4 overflow-y-auto p-2"
            ref={parent}
          >
            {searchResults?.length !== 0 ? (
              searchResults?.map((resource) => (
                <Card
                  className={cn("w-full cursor-pointer hover:ring-1", {
                    "bg-base-100": resource.id === selectedResource?.id,
                  })}
                  key={resource.id}
                  onClick={() => {
                    setSelectedResource(resource);
                  }}
                >
                  <CardHeader>
                    <CardTitle>{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <span className="text-accent-500 w-full text-center text-xs">
                No results for this search.
              </span>
            )}
          </div>
          <div
            className="scrollbar-sm h-full w-2/3 overflow-y-auto p-2"
            ref={parent}
          >
            {selectedResource ? (
              <ResourcePreview
                selectedResource={selectedResource}
                onSelect={onSelect}
                classId={classId}
              />
            ) : (
              <span className="text-accent-500 flex h-full w-full items-center justify-center text-lg">
                Select a resource
              </span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ResourcePreview = ({
  selectedResource,
  onSelect,
  classId,
}: {
  selectedResource: Source;
  onSelect: (content: string) => void;
  classId: string;
}) => {
  return (
    <Card className="flex min-h-full w-full flex-col">
      <CardHeader className="flex flex-row items-center justify-between p-5">
        <div className="flex flex-col space-y-2">
          <CardTitle>{selectedResource?.title}</CardTitle>
          <CardDescription>{selectedResource?.description}</CardDescription>
        </div>
        <Button
          size={"sm"}
          onClick={() => {
            onSelect(selectedResource.content);
          }}
          disabled={selectedResource?.content?.length < 1}
        >
          Use Resource
        </Button>
      </CardHeader>
      <Separator />
      <CardContent className="flex-grow pt-3 text-sm">
        {selectedResource?.content?.length > 0 ? (
          selectedResource.content
        ) : (
          <span className="text-lg text-slate-600">
            You have not added content to this resource. Please edit and add
            content to use it.
          </span>
        )}
      </CardContent>
      <CardFooter className="flex flex-row justify-end">
        <EditResource classId={classId} resourceId={selectedResource.id} />
      </CardFooter>
    </Card>
  );
};

const AddResource = ({ classId }: { classId: string }) => {
  return (
    <div className="flex flex-col items-center space-y-4 text-xl text-white">
      <span className="">{"You don't have any resources in this class."}</span>
      <Link href={url.teacher.resources({ classId })}>
        <IconButton icon={<AddIcon size="xs" />}>Add Resource</IconButton>
      </Link>
    </div>
  );
};

const EditResource = ({
  classId,
  resourceId,
}: {
  classId: string;
  resourceId: string;
}) => {
  return (
    <Link
      href={url.teacher.editResource({
        classId,
        resourceId,
      })}
    >
      <Button variant="ghost" color="primary" size={"icon"}>
        <EditIcon size="xs" color="slate" />
      </Button>
    </Link>
  );
};
