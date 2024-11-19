"use client";

import { SectionHeader, PageHeader } from "@/components/ui/headers";
import { SectionContainer, SubSectionContainer } from "@/components/ui/content-containers";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FilePenLine } from "lucide-react";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useState } from "react";
import { useGetUsers } from "@/lib/queries";

export default function AdminPage() {
  const { data: users } = useGetUsers();
  const [showCreateNewUser, setShowCreateNewUser] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", firstName: "", lastName: "", userGroup: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log(newUser);
  };

  const handleMenuChange = () => {
    if (showCreateNewUser === true) {
      console.log("showCreateNewUser was true, changing to false");
      setShowCreateNewUser(false);
    } else {
      console.log("showCreateNewUser was false, changing to true");
      setShowCreateNewUser(true);
    }
  };

  return (
    <div className="w-full p-4 max-w-[1200px]">
      <PageHeader title="Admin" />
      <SectionContainer>
        <div className="flex justify-between">
          <SectionHeader title="Users" />
          <div className="space-x-2">
            <Button onClick={handleMenuChange} className="bg-green-500">
              Create User
            </Button>
          </div>
        </div>
        <SubSectionContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.username}</TableCell>
                  <TableCell>
                    {capitalizeFirstLetter(item.first_name)} {capitalizeFirstLetter(item.last_name)}
                  </TableCell>
                  <TableCell>{capitalizeFirstLetter(item.user_group)}</TableCell>
                  <TableCell>
                    <div className="bg-transparent flex items-center space-x-2">
                      <FilePenLine size={18} strokeWidth={2} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {showCreateNewUser && (
                <TableRow className="transition-all ">
                  <TableCell>
                    <></>
                  </TableCell>
                  <TableCell className="w-full">
                    <input
                      type="text"
                      name="username"
                      value={newUser.username}
                      onChange={handleInputChange}
                      placeholder="Username"
                      className="p-2 border"
                    />
                  </TableCell>
                  <TableCell className="w-full flex flex-row space-x-2">
                    <input
                      type="text"
                      name="firstName"
                      value={newUser.firstName}
                      onChange={handleInputChange}
                      placeholder="First Name"
                      className="p-2 border"
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={newUser.lastName}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                      className="p-2 border"
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      type="text"
                      name="userGroup"
                      value={newUser.userGroup}
                      onChange={handleInputChange}
                      placeholder="Role"
                      className="p-2 border"
                    />
                  </TableCell>
                  <TableCell>
                    <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded">
                      Submit
                    </button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </SubSectionContainer>
      </SectionContainer>
    </div>
  );
}
