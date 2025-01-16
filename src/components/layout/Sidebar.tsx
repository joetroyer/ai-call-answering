import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Users,
  Brain,
  Phone,
  ChevronDown,
  Plus,
  Settings,
  Sun,
  Moon,
} from 'lucide-react';
import { useWorkspaceStore } from '../../lib/store';

export function Sidebar() {
  const location = useLocation();
  const { workspaces, currentWorkspace } = useWorkspaceStore();

  const navigation = [
    { name: 'Agents', href: '/agents', icon: Users },
    { name: 'Knowledge Base', href: '/knowledge-base', icon: Brain },
    { name: 'Phone Numbers', href: '/phone-numbers', icon: Phone },
  ];

  return (
    <div className="flex h-full w-64 flex-col bg-white">
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="flex h-16 flex-shrink-0 items-center px-4">
          <button className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-900 bg-white hover:bg-gray-50">
            {currentWorkspace?.name || 'Select Workspace'}
            <ChevronDown className="ml-2 h-4 w-4" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md
                  ${
                    location.pathname === item.href
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon
                  className={`
                    mr-3 h-6 w-6 flex-shrink-0
                    ${
                      location.pathname === item.href
                        ? 'text-gray-500'
                        : 'text-gray-400 group-hover:text-gray-500'
                    }
                  `}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
        <div className="group block w-full flex-shrink-0">
          <div className="flex items-center">
            <div>
              <img
                className="inline-block h-9 w-9 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                Tom Cook
              </p>
              <button className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                View profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}