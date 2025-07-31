import { Dialog, Listbox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { ChevronUpDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { getCookie } from "cookies-next";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState, useRef } from "react";
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
  
  // Focus management
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (keypress) {
      setOpen(true);
      setKeyPressDown(false);
    }
  }, [keypress, setKeyPressDown]);

  useEffect(() => {
    if (open) {
      // Focus the close button first, then the title input
      setTimeout(() => {
        closeButtonRef.current?.focus();
        setTimeout(() => {
          titleInputRef.current?.focus();
        }, 100);
      }, 100);
    }
  }, [open]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open]);

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

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog 
        as="div" 
        className="relative z-50" 
        onClose={setOpen}
        initialFocus={titleInputRef}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div 
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
            aria-hidden="true"
          />
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
              <Dialog.Panel 
                className="relative transform overflow-hidden rounded-lg bg-background px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
                ref={modalRef}
                role="dialog"
                aria-modal="true"
              >
                <div className="flex flex-row w-full align-middle">
                  <Dialog.Title 
                    as="h2" 
                    className="text-md pb-2 font-semibold text-sm"
                    id="modal-title"
                  >
                    New Issue
                  </Dialog.Title>

                  <button
                    ref={closeButtonRef}
                    type="button"
                    className="ml-auto mb-1.5 text-foreground font-bold text-xs rounded-md hover:text-primary outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    onClick={() => setOpen(false)}
                    data-testid="close-modal-button"
                    aria-label="Close modal"
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
                
                <div id="modal-description" className="sr-only">
                  Create a new ticket with title, description, priority, status, assignee, and client information.
                </div>
                
                {/* Validation Errors Display */}
                {Object.keys(errors).length > 0 && (
                  <div 
                    className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md"
                    role="alert"
                    aria-live="polite"
                  >
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
                    <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
                      Title <span className="text-red-500" aria-label="required">*</span>
                    </label>
                    <input
                      ref={titleInputRef}
                      type="text"
                      id="title"
                      name="title"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (errors.title) {
                          setErrors(prev => ({ ...prev, title: "" }));
                        }
                      }}
                      className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      placeholder="Enter ticket title"
                      aria-describedby={errors.title ? "title-error" : undefined}
                      aria-invalid={!!errors.title}
                      required
                    />
                    {errors.title && (
                      <div id="title-error" className="text-red-500 text-sm mt-1" role="alert">
                        {errors.title}
                      </div>
                    )}
                  </div>

                  <div className="">
                    <label htmlFor="ticket-name" className="block text-sm font-medium text-foreground mb-1">
                      Name <span className="text-red-500" aria-label="required">*</span>
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
                      className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      data-testid="ticket-name-input"
                      aria-describedby={errors.name ? "name-error" : undefined}
                      aria-invalid={!!errors.name}
                      required
                    />
                    {errors.name && (
                      <div id="name-error" className="text-red-500 text-sm mt-1" role="alert">
                        {errors.name}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="ticket-email" className="block text-sm font-medium text-foreground mb-1">
                      Email <span className="text-red-500" aria-label="required">*</span>
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
                      className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      data-testid="ticket-email-input"
                      aria-describedby={errors.email ? "email-error" : undefined}
                      aria-invalid={!!errors.email}
                      required
                    />
                    {errors.email && (
                      <div id="email-error" className="text-red-500 text-sm mt-1" role="alert">
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="ticket-description" className="block text-sm font-medium text-foreground mb-1">
                      Description <span className="text-red-500" aria-label="required">*</span>
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
                      className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 resize-none"
                      data-testid="ticket-description-input"
                      aria-describedby={errors.issue ? "issue-error" : undefined}
                      aria-invalid={!!errors.issue}
                      required
                    />
                    {errors.issue && (
                      <div id="issue-error" className="text-red-500 text-sm mt-1" role="alert">
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
                      className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      data-testid="ticket-priority-select"
                      aria-describedby="priority-help"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                    <div id="priority-help" className="sr-only">
                      Select the priority level for this ticket
                    </div>
                  </div>

                  <div>
                    <label htmlFor="ticket-type" className="block text-sm font-medium text-foreground mb-1">
                      Type
                    </label>
                    <Listbox value={selected} onChange={setSelected}>
                      <div className="relative mt-1">
                        <Listbox.Button 
                          className="relative w-full cursor-default rounded-lg bg-background py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:text-sm border border-input"
                          aria-label="Select ticket type"
                        >
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="assignee" className="block text-sm font-medium text-foreground mb-1">
                        Assignee
                      </label>
                      <input
                        type="text"
                        id="assignee"
                        name="assignee"
                        value={engineer?.name || ""}
                        onChange={(e) => {
                          const foundUser = users.find(user => user.name === e.target.value);
                          setEngineer(foundUser || null);
                        }}
                        className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        placeholder="Enter assignee"
                      />
                    </div>

                    <div>
                      <label htmlFor="client" className="block text-sm font-medium text-foreground mb-1">
                        Client
                      </label>
                      <input
                        type="text"
                        id="client"
                        name="client"
                        value={company?.name || ""}
                        onChange={(e) => {
                          const foundClient = options.find(client => client.name === e.target.value);
                          setCompany(foundClient || null);
                        }}
                        className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        placeholder="Enter client"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
                
                {isSubmitting && (
                  <div id="submitting-status" className="sr-only" aria-live="polite">
                    Creating ticket, please wait...
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
