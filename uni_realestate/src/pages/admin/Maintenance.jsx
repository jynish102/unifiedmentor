import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Plus,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  Wrench,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Maintenance() {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // ✅ FETCH FROM BACKEND
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/maintenance"); // 🔁 change URL
        setRequests(res.data);
      } catch (err) {
        console.error("Error fetching maintenance data:", err);
      }
    };

    fetchData();
  }, []);

  // FILTER LOGIC
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.unit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.tenant?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ✅ COLORS
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "bg-slate-100 text-slate-700";
      case "medium":
        return "bg-blue-100 text-blue-700";
      case "high":
        return "bg-orange-100 text-orange-700";
      case "urgent":
        return "bg-red-100 text-red-700";
      default:
        return "";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "in-progress":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-slate-100 text-slate-700";
      default:
        return "";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={16} />;
      case "in-progress":
        return <Wrench size={16} />;
      case "completed":
        return <CheckCircle size={16} />;
      case "cancelled":
        return <AlertCircle size={16} />;
      default:
        return null;
    }
  };

  // ✅ STATS (dynamic)
  const stats = [
    { label: "Total Requests", value: requests.length },
    {
      label: "Pending",
      value: requests.filter((r) => r.status === "pending").length,
    },
    {
      label: "In Progress",
      value: requests.filter((r) => r.status === "in-progress").length,
    },
    {
      label: "Completed",
      value: requests.filter((r) => r.status === "completed").length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Maintenance Requests
          </h2>
        </div>
        <Button className="gap-2">
          <Plus size={18} />
          New Request
        </Button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold mt-2">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4 flex-wrap">
            {/* SEARCH */}
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <Input
                placeholder="Search..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* FILTER */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredRequests.map((req) => (
                <TableRow key={req._id}>
                  <TableCell>{req.title}</TableCell>
                  <TableCell>{req.unit}</TableCell>
                  <TableCell>{req.tenant}</TableCell>

                  <TableCell>
                    <Badge className={getPriorityColor(req.priority)}>
                      {req.priority}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge className={getStatusColor(req.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(req.status)}
                        {req.status}
                      </span>
                    </Badge>
                  </TableCell>

                  <TableCell>{req.dateCreated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
