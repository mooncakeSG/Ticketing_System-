import { PlusIcon as PlusIconMini } from "@heroicons/react/20/solid";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Loader from "react-spinners/ClipLoader";

async function fetchNotebooks(token: string) {
  try {
    const response = await fetch('/api/notebooks', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching notebooks:', error);
    return [];
  }
}

function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface NoteBookLayoutProps {
  children: React.ReactNode;
}

export default function NoteBookLayout({ children }: NoteBookLayoutProps) {
  const router = useRouter();
  const token = getCookie("session");

  const { data, status, error, refetch } = useQuery({
    queryKey: ["getUsersNotebooks"],
    queryFn: () => fetchNotebooks(token as string),
    enabled: !!token
  });

  const [notebooks, setNotebooks] = useState<any>();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (data) {
      setNotebooks(data.notebooks);
    }
  }, [data]);

  return (
    <div>
      {status === "pending" && (
        <div className="flex flex-col justify-center items-center h-screen">
          <Loader color="green" size={100} />
        </div>
      )}

      {status === "success" && (
        <div className="">
          <div className="flex flex-row">
            <div className="flex flex-col w-64 border-r-[1px]">
              <div className="flex-row">
                <nav className="flex-1 w-full " aria-label="Sidebar">
                  <div className="border-b-[1px]">
                    <Link
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-600 dark:text-white"
                      href="/notebook/new"
                    >
                      <PlusIconMini className="h-5 w-5" aria-hidden="true" />
                    </Link>
                  </div>
                  {notebooks &&
                    notebooks.map((item: any, index: number) => (
                      <Link
                        key={item.id}
                        href={`/notebook/${item.id}`}
                        className={classNames(
                          router.query.id === item.id
                            ? "bg-green-500 text-white hover:text-white"
                            : "text-gray-900 dark:text-white hover:bg-green-500 hover:text-white hover:bg-opacity-75",
                          "group flex text-left px-2 py-2 w-full text-sm font-medium border-b-[1px] border-gray-200"
                        )}
                      >
                        <div className="flex flex-row items-center justify-between w-full">
                          <span className="truncate">{item.title}</span>
                          {/* <span className="text-right text-xs">
                            {moment(item.updated_at).fromNow()}
                          </span> */}
                        </div>
                      </Link>
                    ))}
                </nav>
              </div>
            </div>
            <div className="flex-1">
              <div className="h-[80vh]">{children}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
