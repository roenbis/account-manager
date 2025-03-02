<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useAccountStore } from "../stores/accountStore";

const store = useAccountStore();
store.loadAccounts();

const validateField = (value: string, maxLength: number) => value.length > 0 && value.length <= maxLength;

const addAccount = () => {
  store.addAccount();
};

const deleteAccount = (id: number) => {
  store.deleteAccount(id);
};

const updateField = (id: number, field: keyof Account, value: string) => {
  if (field === "labels") {
    const labelsArray = value.split(";").map((text) => ({ text: text.trim() })).filter((l) => l.text);
    store.updateAccount(id, { labels: labelsArray });
  } else {
    store.updateAccount(id, { [field]: value });
  }
};

const accounts = computed(() => store.accounts);
</script>

<template>
  <div class="container mx-auto p-4 bg-white shadow rounded">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">Управление учетными записями</h2>
      <button @click="addAccount" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        +
      </button>
    </div>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="account in accounts" :key="account.id" class="border p-3 mb-3 rounded shadow-sm">
        <div class="mb-2">
            <label class="block text-sm font-medium">Метка</label>
            <input
            type="text"
            class="w-full border p-2 rounded"
            :class="{ 'border-red-500': !validateField(account.labels.map(l => l.text).join(';'), 50) }"
            :value="account.labels.map(l => l.text).join(';')"
            @blur="updateField(account.id, 'labels', ($event.target as HTMLInputElement).value)"
            />
            <p class="text-xs text-gray-500">Введите метки через ";"</p>
        </div>

        <div class="mb-2">
            <label class="block text-sm font-medium">Тип записи</label>
            <select
            class="w-full border p-2 rounded"
            :value="account.type"
            @change="updateField(account.id, 'type', ($event.target as HTMLSelectElement).value)"
            >
            <option value="LDAP">LDAP</option>
            <option value="Локальная">Локальная</option>
            </select>
        </div>

        <div class="mb-2">
            <label class="block text-sm font-medium">Логин</label>
            <input
            type="text"
            class="w-full border p-2 rounded"
            :class="{ 'border-red-500': !validateField(account.login, 100) }"
            :value="account.login"
            @blur="updateField(account.id, 'login', ($event.target as HTMLInputElement).value)"
            />
        </div>

        <div v-if="account.type === 'Локальная'" class="mb-2">
            <label class="block text-sm font-medium">Пароль</label>
            <input
            type="password"
            class="w-full border p-2 rounded"
            :class="{ 'border-red-500': !validateField(account.password ?? '', 100) }"
            :value="account.password ?? ''"
            @blur="updateField(account.id, 'password', ($event.target as HTMLInputElement).value)"
            />
        </div>

        <button @click="deleteAccount(account.id)" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
            Удалить
        </button>
        </div>
    </div>
  </div>
</template>
