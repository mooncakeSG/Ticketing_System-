import { Dialog, Listbox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { ChevronUpDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { getCookie } from "cookies-next";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { useUser } from "../../store/session";

import { toast } from "@/shadcn/hooks/use-toast";
import { useSidebar } from "@/shadcn/ui/sidebar";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("../BlockEditor"), { ssr: false });

interface CreateTicketModalProps {
  keypress: boolean;
  setKeyPressDown: (value: boolean) => void;
}

interface TicketType {
  id: number;
  name: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface FormErrors {
  [key: string]: string;
}

function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

const type: TicketType[] = [
  { id: 5, name: "Incident" },
  { id: 1, name: "Service" },
  { id: 2, name: "Feature" },
  { id: 3, name: "Bug" },
  { id: 4, name: "Maintenance" },
  { id: 6, name: "Access" },
  { id: 8, name: "Feedback" },
];

export default function CreateTicketModal({ keypress, setKeyPressDown }: CreateTicketModalProps) {
  const { t, lang } = useTranslation("peppermint");
  const [open, setOpen] = useState<boolean>(false);

  const router = useRouter();

  const token = getCookie("session");

  const { user } = useUser();
  const { state } = useSidebar();

  const [name, setName] = useState<string>("");
  const [company, setCompany] = useState<Client | null>(null);
  const [engineer, setEngineer] = useState<User | null>(null);
  const [email, setEmail] = useState<string>("");
  const [issue, setIssue] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [priority, setPriority] = useState<string>("medium");
  const [options, setOptions] = useState<Client[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<TicketType>(type[3]);
  
  // Add validation state
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchClients = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/v1/clients/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data) {
        setOptions(data.clients || []);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  async function fetchUsers(): Promise<void> {
    try {
      const response = await fetch(`/api/v1/users/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data) {
        // TODO: THINK ABOUT AUTO ASSIGN PREFERENCES
        // setEngineer(user)
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!issue || !issue.trim()) {
      newErrors.issue = "Description is required";
    }
    
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function createTicket(): Promise<void> {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const ticketData = {
        title,
        issue,
        name,
        email,
        priority,
        type: selected.id,
        company: company?.id,
        engineer: engineer?.id,
      };

      const response = await fetch("/api/v1/tickets/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ticketData),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Success",
          description: "Ticket created successfully!",
        });
        setOpen(false);
        router.push(`/tickets/${result.id}`);
      } else {
        throw new Error("Failed to create ticket");
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function checkPress(): void {
    if (keypress) {
      setOpen(true);
      setKeyPressDown(false);
    }
  }

  useEffect(() => {
    checkPress();
  }, [keypress]);

  useEffect(() => {
    if (open) {
      const loadFlags = (): void => {
        fetchClients();
        fetchUsers();
      };
      loadFlags();
    }
  }, [open]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-background px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="flex flex-row w-full align-middle">
                  <span className="text-md pb-2 font-semibold text-sm">
                    New Issue
                  </span>

                  <button
                    type="button"
                    className="ml-auto mb-1.5 text-foreground font-bold text-xs rounded-md hover:text-primary outline-none"
                    onClick={() => setOpen(false)}
                    data-testid="close-modal-button"
                    aria-label="Close modal"
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
                
                {/* Validation Errors Display */}
                {Object.keys(errors).length > 0 && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                    <div className="text-red-400 text-sm font-medium mb-2">
                      Please fix the following errors:
                    </div>
                    <ul className="text-red-400 text-sm space-y-1">
                      {Object.entries(errors).map(([field, message]) => (
                        <li key={field}>• {message}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="">
                    <label htmlFor="ticket-title" className="block text-sm font-medium text-foreground mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      id="ticket-title"
                      name="title"
                      placeholder="Issue title"
                      maxLength={64}
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (errors.title) {
                          setErrors(prev => ({ ...prev, title: "" }));
                        }
                      }}
                      className={`w-full pl-0 pr-0 pt-0 text-md text-foreground bg-background border-none focus:outline-none focus:shadow-none focus:ring-0 focus:border-none ${
                        errors.title ? "border-red-500" : ""
                      }`}
                      data-testid="ticket-title-input"
                      aria-describedby={errors.title ? "title-error" : undefined}
                    />
                    {errors.title && (
                      <div id="title-error" className="text-red-400 text-xs mt-1">
                        {errors.title}
                      </div>
                    )}
                  </div>

                  <div className="">
                    <div>
                      <label htmlFor="ticket-name" className="block text-sm font-medium text-foreground mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="ticket-name"
                        placeholder={t("ticket_name_here")}
                        name="name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) {
                            setErrors(prev => ({ ...prev, name: "" }));
                          }
                        }}
                        className={`w-full pl-0 pr-0 text-foreground bg-background sm:text-sm border-none focus:outline-none focus:shadow-none focus:ring-0 focus:border-none ${
                          errors.name ? "border-red-500" : ""
                        }`}
                        data-testid="ticket-name-input"
                        aria-describedby={errors.name ? "name-error" : undefined}
                      />
                      {errors.name && (
                        <div id="name-error" className="text-red-400 text-xs mt-1">
                          {errors.name}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="ticket-email" className="block text-sm font-medium text-foreground mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="ticket-email"
                      placeholder={t("ticket_email_here")}
                      name="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) {
                          setErrors(prev => ({ ...prev, email: "" }));
                        }
                      }}
                      className={`w-full pl-0 pr-0 text-foreground bg-background sm:text-sm border-none focus:outline-none focus:shadow-none focus:ring-0 focus:border-none ${
                        errors.email ? "border-red-500" : ""
                      }`}
                      data-testid="ticket-email-input"
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                    {errors.email && (
                      <div id="email-error" className="text-red-400 text-xs mt-1">
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="ticket-description" className="block text-sm font-medium text-foreground mb-1">
                      Description *
                    </label>
                    <textarea
                      id="ticket-description"
                      name="issue"
                      rows={4}
                      placeholder="Describe your issue..."
                      value={issue}
                      onChange={(e) => {
                        setIssue(e.target.value);
                        if (errors.issue) {
                          setErrors(prev => ({ ...prev, issue: "" }));
                        }
                      }}
                      className={`w-full pl-0 pr-0 text-foreground bg-background sm:text-sm border-none focus:outline-none focus:shadow-none focus:ring-0 focus:border-none resize-none ${
                        errors.issue ? "border-red-500" : ""
                      }`}
                      data-testid="ticket-description-input"
                      aria-describedby={errors.issue ? "issue-error" : undefined}
                    />
                    {errors.issue && (
                      <div id="issue-error" className="text-red-400 text-xs mt-1">
                        {errors.issue}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="ticket-priority" className="block text-sm font-medium text-foreground mb-1">
                      Priority
                    </label>
                    <select
                      id="ticket-priority"
                      name="priority"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full pl-0 pr-0 text-foreground bg-background sm:text-sm border-none focus:outline-none focus:shadow-none focus:ring-0 focus:border-none"
                      data-testid="ticket-priority-select"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="ticket-type" className="block text-sm font-medium text-foreground mb-1">
                      Type
                    </label>
                    <Listbox value={selected} onChange={setSelected}>
                      <div className="relative mt-1">
                        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-background py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                          <span className="block truncate">{selected.name}</span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </span>
                        </Listbox.Button>
                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-background py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {type.map((ticketType) => (
                              <Listbox.Option
                                key={ticketType.id}
                                className={({ active }) =>
                                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                    active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                  }`
                                }
                                value={ticketType}
                              >
                                {({ selected }) => (
                                  <>
                                    <span
                                      className={`block truncate ${
                                        selected ? 'font-medium' : 'font-normal'
                                      }`}
                                    >
                                      {ticketType.name}
                                    </span>
                                    {selected ? (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      data-testid="cancel-ticket-button"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={createTicket}
                      disabled={isSubmitting}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      data-testid="create-ticket-submit-button"
                      aria-label={isSubmitting ? "Creating ticket..." : "Create ticket"}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Creating...</span>
                        </div>
                      ) : (
                        "Create Ticket"
                      )}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
