"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useOutsideClick } from "~~/hooks/scaffold-stark";
import { CustomConnectButton } from "~~/components/scaffold-stark/CustomConnectButton";
import { useAccount } from "@starknet-react/core";

export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);

  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  const { status } = useAccount();

  return (
    <div className="bg-black lg:static top-0 navbar min-h-16 flex-shrink-0 justify-between z-20 px-0 sm:px-2">
      <div className="navbar-start w-auto lg:w-1/2 -mr-2">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost 
              [@media(max-width:379px)]:!px-3 [@media(max-width:379px)]:!py-1 
              [@media(max-width:379px)]:!h-9 [@media(max-width:379px)]:!min-h-0
              [@media(max-width:379px)]:!w-10
              ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen((prevIsOpenState) => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow rounded-box w-52 bg-base-100"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
            </ul>
          )}
        </div>
        <h1 className="hidden lg:flex items-center gap-2 ml-4 mr-6">
          <div className="flex relative w-20 h-20">
            <Image
              alt="SE2 logo"
              className="cursor-pointer w-"
              fill
              src="/logo.jpg"
            />
          </div>
          <div>
            <span className="font-bold text-2xl leading-tight">YieldStark</span>
          </div>
        </h1>
      </div>
      <div className="navbar-end flex-grow mr-2 gap-4">
        <CustomConnectButton />
      </div>
    </div>
  );
};
