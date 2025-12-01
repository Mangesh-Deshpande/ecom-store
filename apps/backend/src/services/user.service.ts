interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export class UserService {
  private users: User[] = [
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice@example.com",
      createdAt: new Date("2024-01-01"),
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob@example.com",
      createdAt: new Date("2024-01-02"),
    },
  ];

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | null {
    const user = this.users.find((u) => u.id === id);
    return user || null;
  }

  createUser(data: { name: string; email: string }): User {
    const newUser: User = {
      id: String(Date.now() + Math.ceil(Math.random() * 10)),
      name: data.name,
      email: data.email,
      createdAt: new Date(),
    };

    this.users.push(newUser);
    return newUser;
  }

  deleteUser(id: string): boolean {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return false;

    this.users.splice(index, 1);
    return true;
  }
}

export default new UserService();
