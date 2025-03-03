
import Link from "next/link";
import toast from "react-hot-toast";

const ToastCustom = (type: string,message: string, href?: string) => {

    toast.custom((t) => (
      <Link href={href || "#"}
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full shadow-lg rounded-lg  flex ring-1 ring-black ring-opacity-5`}
          style={{
            backgroundColor: 'var(--card-background)',
            zIndex: '999999',
          }}
          onClick={(e) => {
            e.stopPropagation(); // Prevents react-hot-toast from dismissing the toast
            location.href = href ?? '/dashboard'
          }}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
             {/*  <div className="flex-shrink-0 pt-0.5">
                <img
                  className="h-10 w-10 rounded-full"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=6GHAjsWpt9&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                  alt=""
                />
              </div> */}
              <div className="ml-3 flex-1">
                <p className={`text-sm font-medium capitalize ${type === 'error' ? 'text-[tomato]' : 'text-[yellowgreen]'}`}>
                  {type}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {message}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))
}

export default ToastCustom;