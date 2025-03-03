"use client";


import React, { createContext, useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";

import { getToken } from "@/services/api";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import ToastCustom from "../toast/Toast";

export const SocketContext = createContext({
    sendMessageOperator: (message: string) => {},
    sendMessageAdmin: (message: string, gateId: string) => {},
    messages: []
});

interface AuthProviderProps {
    children: React.ReactNode;
}

// Define protected paths (can also use regex or dynamic checks)
const protectedPaths = ['/dashboard'];

export const SocketProvider = ({ children }: AuthProviderProps) => {
    const pathname = usePathname();

    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<any>([])

    useEffect(() => {


        // Check if the current route is protected
        const isProtectedRoute = protectedPaths.some((path) => pathname?.startsWith(path));

        if (!isProtectedRoute) {
            console.log('Not protected route');
            return;
        }




        // Initialize the socket only on the client side
        const token = getToken();

        if (!token) {
            console.error("No token found");
            toast.error("No token found");
            return;
        } else {
            console.log("Token found:", token);
        }
        

        const createSocket = io(process.env.NEXT_PUBLIC_API_URL, {
            query: {
                userId: token,
            },
        });

        setSocket(createSocket)

        

        //Listeners
        createSocket.on('receive-message-operator', (data) => {
            ToastCustom('Nuevo Mensaje',`${data.content}`, `/dashboard/support?gateId=${data.gateId}`)
            console.log(data)
            const messageObject = {
                ...data,

            }
            setMessages((prevMessages: any) => [...prevMessages, data]);
        })

        createSocket.on('receive-message-admin', (data) => {
            ToastCustom('Nuevo Mensaje Soporte',`${data.content}`, '/dashboard/support')
            setMessages((prevMessages: any) => [...prevMessages, data]);
        })


        // Clean up on unmount
        return () => {
            socket?.disconnect();
        };
    }, []);



    const sendMessageOperator = (message: string) => {
        if (socket) {
            const messageObject = {
                type: 'text',
                role: 'operator',
                content: message,
                date: new Date()
            }

            setMessages((prevMessages: any) => [...prevMessages, messageObject]);
            socket.emit("send-message-operator", { message }, (response: any) => {
            });

        } else {
            toast.error("Socket not initialized");
        }
    };

    const sendMessageAdmin = (message: string, gateId: string) => {
        if (socket) {
            const messageObject = {
                type: 'text',
                role: 'admin',
                content: message,
                date: new Date()
            }

            setMessages((prevMessages: any) => [...prevMessages, messageObject]);
            socket.emit("send-message-admin", { message, gateId }, (response: any) => {
            });
        } else {
            toast.error("Socket not initialized");
        }
    };


    return (
        <SocketContext.Provider value={{ sendMessageOperator, sendMessageAdmin, messages }}>
            {children}
        </SocketContext.Provider>
    );
};
