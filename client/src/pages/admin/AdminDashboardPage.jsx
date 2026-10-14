import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import API from '../../services/api.js'
import { logout, reset } from '../../redux/features/auth/authSlice.js'
import { toast } from 'sonner'
import {
  ShieldCheck,
  Users,
  Briefcase,
  CheckCircle2,
  XCircle,
  Phone,
  MapPin,
  Loader2,
  LogOut
} from 'lucide-react'

const AdminDashboardPage = () => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('providers')

  const handleLogout = () => {
    dispatch(logout())
    dispatch(reset())
    toast.success('Admin logged out successfully')
    navigate('/')
  }

  // Fetch Providers
  const {
    data: providers = [],
    isLoading: loadingProviders,
  } = useQuery({
    queryKey: ['admin-providers'],
    queryFn: async () => {
      const res = await API.get('/admin/providers')
      return res.data
    },
  })

  // Fetch Users
  const {
    data: users = [],
    isLoading: loadingUsers,
  } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await API.get('/admin/users')
      return res.data
    },
  })

  // Verify/Toggle Provider Mutation
  const verifyMutation = useMutation({
    mutationFn: async ({ pid, isVerified }) => {
      const res = await API.put(`/admin/providers/${pid}`, { isVerified })
      return res.data
    },
    onSuccess: (updated) => {
      toast.success(
        `Provider "${updated.businessName}" ${updated.isVerified ? 'verified & approved' : 'unverified'}!`
      )
      queryClient.invalidateQueries({ queryKey: ['admin-providers'] })
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Action failed')
    },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-red-100 text-red-600 rounded-lg">
              <ShieldCheck className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-gray-900">Admin Command Center</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Review and verify provider applications, manage user privileges and platform stats.
          </p>
        </div>

        <button
          onClick={handleLogout}
          data-testid="admin-logout-btn"
          className="flex items-center space-x-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-sm font-semibold rounded-xl transition shadow-xs"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Admin</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mt-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('providers')}
          className={`pb-3 px-2 text-sm font-semibold border-b-2 flex items-center space-x-2 transition ${
            activeTab === 'providers'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Provider Applications ({providers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-2 text-sm font-semibold border-b-2 flex items-center space-x-2 transition ${
            activeTab === 'users'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>All Registered Users ({users.length})</span>
        </button>
      </div>

      {/* Tab Content: Providers */}
      {activeTab === 'providers' && (
        <div className="mt-6">
          {loadingProviders ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : providers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500 text-sm">No provider applications found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map((p) => (
                <div
                  key={p._id}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 hover:border-gray-300 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                        {p.providerType}
                      </span>
                      <h3 className="text-base font-bold text-gray-900 mt-1">{p.businessName}</h3>
                      <p className="text-xs text-gray-500">Applicant: {p.user?.name || 'Unknown'}</p>
                    </div>

                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        p.isVerified
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {p.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span>{p.contactNumber}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span className="truncate">{p.businessAddress}</span>
                    </div>
                    {p.description && (
                      <p className="pt-1 text-gray-500 italic">"{p.description}"</p>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                    <span className="text-[11px] text-gray-400">
                      User Role: <strong>{p.user?.userType}</strong>
                    </span>

                    <button
                      onClick={() =>
                        verifyMutation.mutate({
                          pid: p._id,
                          isVerified: !p.isVerified,
                        })
                      }
                      disabled={verifyMutation.isPending}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1 transition ${
                        p.isVerified
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {p.isVerified ? (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Revoke Status</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verify & Approve</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Users */}
      {activeTab === 'users' && (
        <div className="mt-6 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {loadingUsers ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email & Phone</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Referral Code</th>
                    <th className="px-6 py-3">Wallet</th>
                    <th className="px-6 py-3">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-semibold text-gray-900">{u.name}</td>
                      <td className="px-6 py-4">
                        <div>{u.email}</div>
                        <div className="text-xs text-gray-400">{u.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                            u.userType === 'ADMIN'
                              ? 'bg-red-100 text-red-700'
                              : u.userType === 'PROVIDER'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {u.userType}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">{u.referralCode || '-'}</td>
                      <td className="px-6 py-4 font-bold text-green-600">₹{u.walletBalance || 0}</td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminDashboardPage
