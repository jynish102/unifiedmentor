import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  CreditCard,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const monthlyData = [
  { month: "Jan", income: 45000, expenses: 12000, profit: 33000 },
  { month: "Feb", income: 52000, expenses: 15000, profit: 37000 },
  { month: "Mar", income: 48000, expenses: 13000, profit: 35000 },
  { month: "Apr", income: 61000, expenses: 18000, profit: 43000 },
  { month: "May", income: 55000, expenses: 14000, profit: 41000 },
  { month: "Jun", income: 67000, expenses: 16000, profit: 51000 },
];

const recentTransactions = [
  {
    id: 1,
    property: "Sunset Apartments #302",
    tenant: "Sarah Johnson",
    amount: 2500,
    type: "income",
    status: "completed",
    date: "2026-03-28",
    method: "Bank Transfer",
  },
  {
    id: 2,
    property: "Ocean View Villa",
    description: "Pool Maintenance",
    amount: 450,
    type: "expense",
    status: "completed",
    date: "2026-03-27",
    method: "Credit Card",
  },
  {
    id: 3,
    property: "Downtown Loft #12",
    tenant: "Michael Chen",
    amount: 3200,
    type: "income",
    status: "pending",
    date: "2026-03-26",
    method: "Check",
  },
  {
    id: 4,
    property: "Garden Apartments #105",
    tenant: "Emily Rodriguez",
    amount: 2800,
    type: "income",
    status: "completed",
    date: "2026-03-25",
    method: "Bank Transfer",
  },
  {
    id: 5,
    property: "All Properties",
    description: "Property Insurance",
    amount: 1200,
    type: "expense",
    status: "completed",
    date: "2026-03-24",
    method: "Bank Transfer",
  },
  {
    id: 6,
    property: "Riverside Condo",
    description: "HVAC Repair",
    amount: 680,
    type: "expense",
    status: "completed",
    date: "2026-03-23",
    method: "Credit Card",
  },
];

const upcomingPayments = [
  {
    id: 1,
    property: "Suburban Family Home",
    tenant: "The Martinez Family",
    amount: 3500,
    dueDate: "2026-04-01",
    status: "due",
  },
  {
    id: 2,
    property: "Ocean View Villa",
    tenant: "Michael Chen",
    amount: 6500,
    dueDate: "2026-04-01",
    status: "due",
  },
  {
    id: 3,
    property: "Garden Apartments #105",
    tenant: "Emily Rodriguez",
    amount: 2800,
    dueDate: "2026-04-05",
    status: "upcoming",
  },
];

export  function Financials() {
  const totalIncome = monthlyData[monthlyData.length - 1].income;
  const totalExpenses = monthlyData[monthlyData.length - 1].expenses;
  const netProfit = monthlyData[monthlyData.length - 1].profit;
  const profitMargin = ((netProfit / totalIncome) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Financials</h2>
          <p className="text-gray-600 mt-1">
            Track income, expenses, and profitability
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <Download className="size-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Income
            </CardTitle>
            <TrendingUp className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalIncome.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 mt-1">
              +12.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Expenses
            </CardTitle>
            <TrendingDown className="size-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600 mt-1">+8.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Net Profit
            </CardTitle>
            <DollarSign className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${netProfit.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 mt-1">
              +14.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Profit Margin
            </CardTitle>
            <TrendingUp className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {profitMargin}%
            </div>
            <p className="text-xs text-gray-600 mt-1">Above industry avg</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="income" fill="#10b981" name="Income" />
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Profit Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Profit Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Profit"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start space-x-4 flex-1">
                  <div
                    className={`p-2 rounded-lg ${
                      transaction.type === "income"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <TrendingUp className="size-5 text-green-600" />
                    ) : (
                      <TrendingDown className="size-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900">
                      {transaction.property}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {transaction.tenant || transaction.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500 flex items-center">
                        <Calendar className="size-3 mr-1" />
                        {new Date(transaction.date).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <CreditCard className="size-3 mr-1" />
                        {transaction.method}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-3 sm:mt-0">
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}$
                      {transaction.amount.toLocaleString()}
                    </p>
                    <Badge
                      className={
                        transaction.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    >
                      {transaction.status === "completed" ? (
                        <CheckCircle className="size-3 mr-1" />
                      ) : (
                        <AlertCircle className="size-3 mr-1" />
                      )}
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {payment.property}
                  </h4>
                  <p className="text-sm text-gray-600">{payment.tenant}</p>
                </div>
                <div className="flex items-center space-x-4 mt-3 sm:mt-0">
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      ${payment.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Calendar className="size-3 mr-1" />
                      Due: {new Date(payment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    className={
                      payment.status === "due"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-blue-100 text-blue-700"
                    }
                  >
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
