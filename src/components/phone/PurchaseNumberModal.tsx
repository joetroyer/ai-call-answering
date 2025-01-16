import React, { useState } from 'react';
import { X, Search, Phone } from 'lucide-react';

interface PurchaseNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (data: {
    provider: string;
    accountId: string;
    number: string;
    capabilities: string[];
  }) => void;
  providers: {
    id: string;
    name: 'Twilio' | 'Telnyx';
    accounts: {
      id: string;
      name: string;
    }[];
  }[];
}

export function PurchaseNumberModal({ isOpen, onClose, onPurchase, providers }: PurchaseNumberModalProps) {
  const [step, setStep] = useState<'search' | 'select'>('search');
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [searchType, setSearchType] = useState<'areaCode' | 'zipCode'>('areaCode');
  const [searchValue, setSearchValue] = useState('');
  const [capabilities, setCapabilities] = useState<string[]>(['voice', 'sms']);
  
  // Mock available numbers - in real app, this would come from API
  const availableNumbers = [
    { number: '+1 (555) 123-4567', monthlyPrice: 1.00 },
    { number: '+1 (555) 234-5678', monthlyPrice: 1.00 },
    { number: '+1 (555) 345-6789', monthlyPrice: 0.85 },
  ];

  const handleSearch = () => {
    // In real app, this would call the provider's API
    setStep('select');
  };

  const handlePurchase = (number: string) => {
    onPurchase({
      provider: selectedProvider,
      accountId: selectedAccount,
      number,
      capabilities,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg font-semibold leading-6 text-gray-900">
                Purchase New Number
              </h3>
              
              {step === 'search' ? (
                <div className="mt-4">
                  <div className="space-y-4">
                    {/* Provider Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Provider</label>
                      <select
                        value={selectedProvider}
                        onChange={(e) => setSelectedProvider(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="">Select Provider</option>
                        {providers.map((provider) => (
                          <option key={provider.id} value={provider.name}>
                            {provider.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Account Selection */}
                    {selectedProvider && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Account</label>
                        <select
                          value={selectedAccount}
                          onChange={(e) => setSelectedAccount(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="">Select Account</option>
                          {providers
                            .find(p => p.name === selectedProvider)
                            ?.accounts.map((account) => (
                              <option key={account.id} value={account.id}>
                                {account.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    )}

                    {/* Search Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Search By</label>
                      <div className="mt-2 flex space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            value="areaCode"
                            checked={searchType === 'areaCode'}
                            onChange={(e) => setSearchType(e.target.value as 'areaCode')}
                            className="form-radio h-4 w-4 text-indigo-600"
                          />
                          <span className="ml-2 text-sm text-gray-700">Area Code</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            value="zipCode"
                            checked={searchType === 'zipCode'}
                            onChange={(e) => setSearchType(e.target.value as 'zipCode')}
                            className="form-radio h-4 w-4 text-indigo-600"
                          />
                          <span className="ml-2 text-sm text-gray-700">ZIP Code</span>
                        </label>
                      </div>
                    </div>

                    {/* Search Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {searchType === 'areaCode' ? 'Area Code' : 'ZIP Code'}
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          value={searchValue}
                          onChange={(e) => setSearchValue(e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder={searchType === 'areaCode' ? '415' : '94105'}
                        />
                      </div>
                    </div>

                    {/* Capabilities */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Capabilities</label>
                      <div className="mt-2 space-y-2">
                        {['voice', 'sms', 'mms', 'fax'].map((cap) => (
                          <label key={cap} className="inline-flex items-center mr-4">
                            <input
                              type="checkbox"
                              checked={capabilities.includes(cap)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setCapabilities([...capabilities, cap]);
                                } else {
                                  setCapabilities(capabilities.filter(c => c !== cap));
                                }
                              }}
                              className="form-checkbox h-4 w-4 text-indigo-600"
                            />
                            <span className="ml-2 text-sm text-gray-700 uppercase">{cap}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      onClick={handleSearch}
                      disabled={!selectedProvider || !selectedAccount || !searchValue}
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-gray-300 sm:ml-3 sm:w-auto"
                    >
                      Search Numbers
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <div className="space-y-4">
                    {availableNumbers.map((number) => (
                      <div
                        key={number.number}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div>
                          <div className="flex items-center">
                            <Phone className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-lg font-medium">{number.number}</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            ${number.monthlyPrice.toFixed(2)}/month
                          </p>
                        </div>
                        <button
                          onClick={() => handlePurchase(number.number)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          Purchase
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      onClick={() => setStep('search')}
                      className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    >
                      Back to Search
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}