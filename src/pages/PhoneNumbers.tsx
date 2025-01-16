import React, { useState } from 'react';
import { Plus, Settings, Trash2, ExternalLink, RefreshCw, Search } from 'lucide-react';
import { AccountModal } from '../components/phone/AccountModal';
import { PurchaseNumberModal } from '../components/phone/PurchaseNumberModal';

interface Provider {
  id: string;
  name: 'Twilio' | 'Telnyx';
  accounts: Account[];
}

interface Account {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  providerId: string;
  apiKey?: string;
  apiSecret?: string;
}

interface PhoneNumber {
  id: string;
  number: string;
  provider: 'Twilio' | 'Telnyx';
  accountId: string;
  capabilities: string[];
  monthlyPrice: number;
  status: 'active' | 'inactive';
}

export function PhoneNumbersPage() {
  const [providers, setProviders] = useState<Provider[]>([
    {
      id: '1',
      name: 'Twilio',
      accounts: [
        { id: '1', name: 'Production Account', status: 'connected', providerId: '1' },
        { id: '2', name: 'Development Account', status: 'connected', providerId: '1' },
      ],
    },
    {
      id: '2',
      name: 'Telnyx',
      accounts: [
        { id: '3', name: 'Main Account', status: 'connected', providerId: '2' },
      ],
    },
  ]);

  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([
    {
      id: '1',
      number: '+1 (555) 123-4567',
      provider: 'Twilio',
      accountId: '1',
      capabilities: ['voice', 'sms', 'mms'],
      monthlyPrice: 1.00,
      status: 'active',
    },
    {
      id: '2',
      number: '+1 (555) 234-5678',
      provider: 'Twilio',
      accountId: '2',
      capabilities: ['voice', 'sms'],
      monthlyPrice: 1.00,
      status: 'active',
    },
    {
      id: '3',
      number: '+1 (555) 345-6789',
      provider: 'Telnyx',
      accountId: '3',
      capabilities: ['voice', 'sms', 'mms', 'fax'],
      monthlyPrice: 0.85,
      status: 'active',
    },
  ]);

  const [activeTab, setActiveTab] = useState<'providers' | 'numbers'>('providers');
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'Twilio' | 'Telnyx' | null>(null);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProvider, setFilterProvider] = useState<'all' | 'Twilio' | 'Telnyx'>('all');

  const getAccountByNumber = (number: PhoneNumber) => {
    const provider = providers.find(p => p.name === number.provider);
    return provider?.accounts.find(a => a.id === number.accountId);
  };

  const handleDeleteAccount = (providerId: string, accountId: string) => {
    const updatedPhoneNumbers = phoneNumbers.filter(
      number => !(number.provider === providers.find(p => p.id === providerId)?.name && number.accountId === accountId)
    );
    setPhoneNumbers(updatedPhoneNumbers);

    const updatedProviders = providers.map(provider => {
      if (provider.id === providerId) {
        return {
          ...provider,
          accounts: provider.accounts.filter(account => account.id !== accountId)
        };
      }
      return provider;
    });
    setProviders(updatedProviders);
  };

  const handleDeleteNumber = (numberId: string) => {
    setPhoneNumbers(phoneNumbers.filter(number => number.id !== numberId));
  };

  const handleAddAccount = (data: { name: string; apiKey: string; apiSecret: string }) => {
    if (!selectedProvider) return;

    const newAccount: Account = {
      id: crypto.randomUUID(),
      name: data.name,
      status: 'connected',
      providerId: providers.find(p => p.name === selectedProvider)?.id || '',
      apiKey: data.apiKey,
      apiSecret: data.apiSecret,
    };

    const updatedProviders = providers.map(provider => {
      if (provider.name === selectedProvider) {
        return {
          ...provider,
          accounts: [...provider.accounts, newAccount]
        };
      }
      return provider;
    });

    setProviders(updatedProviders);
  };

  const handleEditAccount = (data: { name: string; apiKey: string; apiSecret: string }) => {
    if (!editingAccount || !selectedProvider) return;

    const updatedProviders = providers.map(provider => {
      if (provider.name === selectedProvider) {
        return {
          ...provider,
          accounts: provider.accounts.map(account => 
            account.id === editingAccount.id
              ? { ...account, ...data }
              : account
          )
        };
      }
      return provider;
    });

    setProviders(updatedProviders);
  };

  const handlePurchaseNumber = (data: {
    provider: string;
    accountId: string;
    number: string;
    capabilities: string[];
  }) => {
    const newNumber: PhoneNumber = {
      id: crypto.randomUUID(),
      number: data.number,
      provider: data.provider as 'Twilio' | 'Telnyx',
      accountId: data.accountId,
      capabilities: data.capabilities,
      monthlyPrice: data.provider === 'Twilio' ? 1.00 : 0.85,
      status: 'active',
    };

    setPhoneNumbers([...phoneNumbers, newNumber]);
  };

  const filteredNumbers = phoneNumbers.filter(number => {
    const matchesSearch = number.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getAccountByNumber(number)?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      number.capabilities.some(cap => cap.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesProvider = filterProvider === 'all' || number.provider === filterProvider;
    
    return matchesSearch && matchesProvider;
  });

  return (
    <div className="flex-1 bg-white">
      <div className="border-b border-gray-200">
        <div className="px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Phone Numbers</h1>
            <button 
              onClick={() => setIsPurchaseModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Number
            </button>
          </div>
          <div className="mt-4 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('providers')}
                className={`${
                  activeTab === 'providers'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Providers & Accounts
              </button>
              <button
                onClick={() => setActiveTab('numbers')}
                className={`${
                  activeTab === 'numbers'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Phone Numbers
              </button>
            </nav>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {activeTab === 'providers' ? (
          <div className="space-y-6">
            {providers.map((provider) => (
              <div key={provider.id} className="bg-white border rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <img 
                        src={provider.name === 'Twilio' 
                          ? 'https://www.twilio.com/assets/icons/twilio-icon.svg'
                          : 'https://avatars.githubusercontent.com/u/10522416?s=200&v=4'
                        } 
                        alt={`${provider.name} logo`}
                        className="h-8 w-8 mr-3"
                      />
                      <h3 className="text-lg font-medium text-gray-900">{provider.name}</h3>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedProvider(provider.name);
                        setEditingAccount(null);
                        setIsAccountModalOpen(true);
                      }}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Plus className="h-4 w-4 mr-1.5" />
                      Add Account
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {provider.accounts.map((account) => (
                    <div key={account.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className={`h-3 w-3 rounded-full ${
                              account.status === 'connected' ? 'bg-green-400' :
                              account.status === 'error' ? 'bg-red-400' : 'bg-gray-400'
                            }`} />
                          </div>
                          <div className="ml-4">
                            <h4 className="text-sm font-medium text-gray-900">{account.name}</h4>
                            <p className="text-sm text-gray-500 capitalize">{account.status}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-500">
                            <RefreshCw className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedProvider(provider.name);
                              setEditingAccount(account);
                              setIsAccountModalOpen(true);
                            }}
                            className="p-2 text-gray-400 hover:text-gray-500"
                          >
                            <Settings className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteAccount(provider.id, account.id)}
                            className="p-2 text-gray-400 hover:text-gray-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search numbers, accounts, or capabilities..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <select
                value={filterProvider}
                onChange={(e) => setFilterProvider(e.target.value as 'all' | 'Twilio' | 'Telnyx')}
                className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="all">All Providers</option>
                <option value="Twilio">Twilio</option>
                <option value="Telnyx">Telnyx</option>
              </select>
            </div>

            {/* Phone Numbers Table */}
            <div className="bg-white border rounded-lg shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone Number
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Provider
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Account
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Capabilities
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monthly Price
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredNumbers.map((number) => {
                      const account = getAccountByNumber(number);
                      return (
                        <tr key={number.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {number.number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <img 
                                src={number.provider === 'Twilio' 
                                  ? 'https://www.twilio.com/assets/icons/twilio-icon.svg'
                                  : 'https://avatars.githubusercontent.com/u/10522416?s=200&v=4'
                                } 
                                alt={`${number.provider} logo`}
                                className="h-5 w-5 mr-2"
                              />
                              {number.provider}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {account?.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-1">
                              {number.capabilities.map((cap) => (
                                <span
                                  key={cap}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                  {cap.toUpperCase()}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${number.monthlyPrice.toFixed(2)}/mo
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button className="text-gray-400 hover:text-gray-500">
                                <Settings className="h-4 w-4" />
                              </button>
                              <button className="text-gray-400 hover:text-gray-500">
                                <ExternalLink className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteNumber(number.id)}
                                className="text-gray-400 hover:text-gray-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Account Modal */}
      {selectedProvider && (
        <AccountModal
          isOpen={isAccountModalOpen}
          onClose={() => {
            setIsAccountModalOpen(false);
            setSelectedProvider(null);
            setEditingAccount(null);
          }}
          onSubmit={editingAccount ? handleEditAccount : handleAddAccount}
          provider={selectedProvider}
          editingAccount={editingAccount}
        />
      )}

      {/* Purchase Number Modal */}
      <PurchaseNumberModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        onPurchase={handlePurchaseNumber}
        providers={providers}
      />
    </div>
  );
}