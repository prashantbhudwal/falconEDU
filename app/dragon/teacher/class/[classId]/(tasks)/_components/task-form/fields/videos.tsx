"use client";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { AddIcon, MinusIcon } from "@/components/icons";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { debounce } from "lodash";
import { VideoDialog } from "../../video-dialog";
import ReactPlayer from "react-player";
import { formatUrl } from "@/app/dragon/teacher/utils";

export const VideoField = ({ name }: { name: string }) => {
  const form = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: name,
  });
  const updateUrl = debounce((url: string, index: number) => {
    form.setValue(`${name}[${index}].url`, url);
    form.trigger(`${name}[${index}].url`);
  }, 300);

  const handleBlur = (
    event: React.FocusEvent<HTMLInputElement>,
    index: number,
  ) => {
    const url = formatUrl(event.target.value);
    updateUrl(url, index); // Use the debounced function
  };

  const addVideoField = () => {
    append({ title: "", url: "", metadata: "" });
  };

  const removeVideoField = (index: number) => {
    remove(index); // Remove a video URL
  };

  const allowVideoAddition = fields.length < 5 && fields.length > 0;

  return (
    <div className="max-w-2xl space-y-2">
      <div className="flex items-center space-x-5">
        <FormLabel>Videos</FormLabel>
        {fields.length === 0 && <AddVideoButton onClick={addVideoField} />}
      </div>
      <FormDescription>
        Add upto 5 videos that will be shown to the students. (optional)
      </FormDescription>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <Card key={field.id} className="relative ">
            <RemoveVideoButton onClick={() => removeVideoField(index)} />
            <CardHeader>
              <CardTitle>
                <FormField
                  control={form.control}
                  name={`${name}[${index}].title`}
                  render={({
                    field: titleField,
                    fieldState: { error: titleError },
                  }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          required
                          autoComplete="off"
                          className="text-sm"
                          placeholder={`Title`}
                          {...titleField}
                        />
                      </FormControl>
                      {titleError && (
                        <div className="text-xs text-destructive">
                          {titleError.message}
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <FormField
                control={form.control}
                name={`${name}[${index}].url`}
                render={({
                  field: urlField,
                  fieldState: { error: urlError },
                }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        required
                        autoComplete="off"
                        className="text-sm"
                        placeholder={`www.youtube.com/`}
                        {...urlField}
                        onBlur={(e) => handleBlur(e, index)}
                      />
                    </FormControl>
                    {urlError && (
                      <div className="text-xs text-destructive">
                        {urlError.message}
                      </div>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`${name}[${index}].metadata`}
                render={({
                  field: metadataField,
                  fieldState: { error: metadataError },
                }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        className="text-sm"
                        placeholder={`description (optional)`}
                        {...metadataField}
                      />
                    </FormControl>
                    {metadataError && (
                      <div className="text-xs text-destructive">
                        {metadataError.message}
                      </div>
                    )}
                  </FormItem>
                )}
              />
            </CardContent>
            <PreviewVideo
              url={form.getValues(`${name}[${index}].url`)}
              title={form.getValues(`${name}[${index}].title`)}
            />
          </Card>
        ))}
      </div>
      {allowVideoAddition && <AddMoreVideosButton onClick={addVideoField} />}
    </div>
  );
};

const PreviewVideo = ({ url, title }: { url: string; title: string }) => {
  return (
    <CardFooter className="flex items-baseline space-x-2">
      {url && !ReactPlayer.canPlay(url) ? (
        <div className="text-xs text-warning">This video is not supported.</div>
      ) : url ? (
        <VideoDialog url={url} title={title} />
      ) : null}
    </CardFooter>
  );
};

const AddVideoButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      type="button"
      variant={"ghost"}
      size={"icon"}
      onClick={onClick}
      className="rounded-full"
    >
      <AddIcon size={"xs"} />
    </Button>
  );
};

const AddMoreVideosButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      type="button"
      variant={"ghost"}
      size={"icon"}
      onClick={onClick}
      className="w-full"
    >
      <div className="flex items-center space-x-2">
        <AddIcon size={"xs"} />
        <span>Add more videos</span>
      </div>
    </Button>
  );
};

const RemoveVideoButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="absolute -right-6 h-4 w-4 rounded-full hover:scale-110 hover:bg-base-300 hover:ring-1 hover:ring-destructive"
    >
      <MinusIcon size="xs" color="destructive" />
    </Button>
  );
};
