import React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

type Status = {
  value: string;
  label: string;
  icon: LucideIcon;
};

type User = {
  value: string;
  name: string;
  icon?: LucideIcon;
};

type Client = {
  value: string;
  name: string;
  icon?: LucideIcon;
};

interface UserComboProps {
  value: User[];
  update: (user: User | null) => void;
  defaultName?: string;
  hideInitial?: boolean;
  showIcon?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

interface IconComboProps {
  value: Status[];
  update: (status: Status | null) => void;
  defaultName?: string;
  hideInitial?: boolean;
  disabled?: boolean;
}

interface ClientComboProps {
  value: Client[];
  update: (client: Client | null) => void;
  defaultName?: string;
  hideInitial?: boolean;
  showIcon?: boolean;
  disabled?: boolean;
}

export function UserCombo({
  value,
  update,
  defaultName,
  hideInitial,
  showIcon,
  disabled,
  placeholder,
}: UserComboProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<any | null>(null);

  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-[180px] justify-start border-none"
            disabled={disabled}
          >
            {selectedStatus ? (
              <div className="flex flex-row space-x-2 w-[120px]">
                {!hideInitial && (
                  <div className="flex-shrink-0">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-500">
                      <span className="text-xs font-medium leading-none text-white uppercase ">
                        {selectedStatus.name[0]}
                      </span>
                    </span>
                  </div>
                )}
                <span>{defaultName}</span>
              </div>
            ) : defaultName ? (
              <>
                <div className="flex flex-row space-x-3">
                  {!hideInitial && (
                    <div className="flex-shrink-0">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-500">
                        <span className="text-xs font-medium leading-none text-white uppercase ">
                          {defaultName[0]}
                        </span>
                      </span>
                    </div>
                  )}
                  <span className="">{defaultName}</span>
                </div>
              </>
            ) : (
              <span>unassigned</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  className=" hover:cursor-pointer"
                  value={undefined}
                  onSelect={() => {
                    setSelectedStatus(null);
                    update(null);
                    setOpen(false);
                  }}
                >
                  {/* <val.icon
                      className={cn(
                        "mr-2 h-4 w-4",
                        val.value === selectedStatus?.value
                          ? "opacity-100"
                          : "opacity-40"
                      )}
                    /> */}
                  <span>Unassign</span>
                </CommandItem>
                {value.map((val: User) => (
                  <CommandItem
                    className=" hover:cursor-pointer"
                    key={val.value}
                    value={val}
                    onSelect={(selected) => {
                      const user = value.find((k: User) => k.name === selected);
                      setSelectedStatus(user);
                      update(user);
                      setOpen(false);
                    }}
                  >
                    <span>{val.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function IconCombo({
  value,
  update,
  defaultName,
  hideInitial,
  disabled,
}: IconComboProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<any | null>(null);
  const defaultIcon = value.find((k: Status) => k.value === defaultName);

  console.log(disabled);

  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-[180px] justify-start border-none"
            disabled={disabled}
          >
            {selectedStatus ? (
              <div className="flex flex-row space-x-2 w-[120px]">
                {!hideInitial && (
                  <div className="flex-shrink-0">
                    <span className="inline-flex h-6 w-6 pl-2.5 items-center justify-center ">
                      <span className="text-xs font-medium leading-none text-foreground uppercase ">
                        <selectedStatus.icon className="mr-2 h-4 w-4 shrink-0" />
                      </span>
                    </span>
                  </div>
                )}
                <span className="mt-[2.5px] capitalize">
                  {selectedStatus.value}
                </span>
              </div>
            ) : defaultName ? (
              <div className="flex flex-row space-x-2">
                <div className="flex-shrink-0">
                  <span className="inline-flex h-6 w-6 pl-2.5 items-center justify-center ">
                    <span className="text-xs font-medium leading-none text-foreground uppercase ">
                      {defaultIcon && (
                        <defaultIcon.icon className="mr-2 h-4 w-4 shrink-0" />
                      )}
                    </span>
                  </span>
                </div>
                <span className="mt-[2.5px] capitalize">{defaultName}</span>
              </div>
            ) : (
              <span>unassigned</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command>
            {/* <CommandInput placeholder="Change status..." /> */}
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {value.map((val: Status) => (
                  <CommandItem
                    className=" hover:cursor-pointer"
                    key={val.value}
                    value={val}
                    onSelect={(selected) => {
                      const user = value.find((k: Status) => k.name === selected);
                      setSelectedStatus(user);
                      update(user);
                      setOpen(false);
                    }}
                  >
                    <span>{val.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function ClientCombo({
  value,
  update,
  defaultName,
  hideInitial,
  showIcon,
  disabled,
}: ClientComboProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<any | null>(null);

  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-[180px] justify-start border-none"
            disabled={disabled}
          >
            {selectedStatus ? (
              <div className="flex flex-row space-x-2 w-[120px]">
                <div className="flex-shrink-0">
                  <span className="inline-flex h-6 w-6 pl-2.5 items-center justify-center ">
                    <span className="text-xs font-medium leading-none text-foreground uppercase ">
                      <Coffee className="mr-2 h-4 w-4 shrink-0 " />
                    </span>
                  </span>
                </div>
                <span className="mt-[2px]">{defaultName}</span>
              </div>
            ) : defaultName ? (
              <>
                <div className="flex flex-row items-center space-x-2">
                  <div className="flex-shrink-0">
                    <span className="inline-flex h-6 w-6 pl-2.5 items-center justify-center ">
                      <span className="text-xs font-medium leading-none text-foreground uppercase ">
                        <Coffee className="mr-2 h-4 w-4 shrink-0 " />
                      </span>
                    </span>
                  </div>
                  <span>{defaultName}</span>
                </div>
              </>
            ) : (
              <span>unassigned</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandInput placeholder="Change client..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  className=" hover:cursor-pointer"
                  value={undefined}
                  onSelect={() => {
                    setSelectedStatus(null);
                    update(null);
                    setOpen(false);
                  }}
                >
                  {/* <val.icon
                      className={cn(
                        "mr-2 h-4 w-4",
                        val.value === selectedStatus?.value
                          ? "opacity-100"
                          : "opacity-40"
                      )}
                    /> */}
                  <span>Unassign</span>
                </CommandItem>
                {value.map((val: Client) => (
                  <CommandItem
                    className=" hover:cursor-pointer"
                    key={val.value}
                    value={val}
                    onSelect={(selected) => {
                      const user = value.find((k: Client) => k.name === selected);
                      setSelectedStatus(user);
                      update(user);
                      setOpen(false);
                    }}
                  >
                    <span>{val.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
