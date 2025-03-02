import { defineStore } from "pinia";

export interface Account {
  id: number;
  labels: { text: string }[];
  type: "LDAP" | "Локальная";
  login: string;
  password: string | null;
}

export const useAccountStore = defineStore("accountStore", {
  state: () => ({
    accounts: [] as Account[],
  }),
  actions: {
    loadAccounts() {
      const stored = localStorage.getItem("accounts");
      this.accounts = stored ? JSON.parse(stored) : [];
    },
    saveAccounts() {
      localStorage.setItem("accounts", JSON.stringify(this.accounts));
    },
    addAccount() {
      this.accounts.push({
        id: Date.now(),
        labels: [],
        type: "LDAP",
        login: "",
        password: null,
      });
      this.saveAccounts();
    },
    updateAccount(id: number, data: Partial<Account>) {
      const index = this.accounts.findIndex((acc) => acc.id === id);
      if (index !== -1) {
        this.accounts[index] = { ...this.accounts[index], ...data };
        this.saveAccounts();
      }
    },
    deleteAccount(id: number) {
      this.accounts = this.accounts.filter((acc) => acc.id !== id);
      this.saveAccounts();
    },
  },
});
