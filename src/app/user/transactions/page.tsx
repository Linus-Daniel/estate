// app/tenant/pay/page.tsx
"use client";

import { use, useEffect, useState } from "react";
import { DollarSign, CreditCard, Banknote, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserTransactions } from "@/lib/api";
import { useAuth } from "@/context/auth_context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TableBody,
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

import { Transaction } from "@/types";

export default function PaymentPage() {
  const [transactions, setTransactions] = useState<Transaction[]>();
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    if (!user?._id) return;
  
    (async () => {
      try {
        setIsLoading(true)
        const userId = user._id;
        const response = await getUserTransactions(userId);
        console.log("API response:", response); // Log here
        setTransactions(response as unknown as Transaction[]);

      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        setIsLoading(false)
      }
      finally{
        setIsLoading(false)
      }
    })();
  }, [user?._id]);
  
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

 
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Transaction History</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline">Filter</Button>
              <Button variant="outline">Export</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions?.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell className="font-medium">
                      {typeof transaction.property === 'object' ? 
                        transaction.property.title : 
                        'Property Loading...'}
                    </TableCell>
                    <TableCell>${transaction.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          transaction.status === 'completed' ? 'default' : 
                          transaction.status === 'pending' ? 'secondary' : 'destructive'
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.transactionId}</TableCell>
                    <TableCell className="capitalize">{transaction.paymentMethod}</TableCell>
                    <TableCell>
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Link href={`/user/transactions/${transaction._id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
