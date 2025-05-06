"use client"
import { Transaction } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { getUserTransactionById } from "@/lib/api";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Image from "next/image";

export default function TransactionDetailPage() {
  const params = useParams();
  const id = params._id as string;
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [transaction, setTransaction] = useState<Transaction>();

  useEffect(() => {
    if (!id) return;
    
    setIsLoading(true);
    (async () => {
      try {
        const response = await getUserTransactionById(id);
        setTransaction(response as unknown as Transaction);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  const handlePrintReceipt = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow && receiptRef.current) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt #${transaction?.transactionId}</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
              body { font-family: 'Inter', sans-serif; padding: 0; margin: 0; background: #f8fafc; }
              .receipt-container { max-width: 600px; margin: 0 auto; padding: 2rem; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
              .header { text-align: center; margin-bottom: 2rem; }
              .logo { font-size: 1.5rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem; }
              .receipt-title { font-size: 1.25rem; font-weight: 600; color: #1e293b; }
              .receipt-id { color: #64748b; font-size: 0.875rem; }
              .section { margin-bottom: 1.5rem; }
              .section-title { font-weight: 600; color: #1e293b; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e2e8f0; }
              .row { display: flex; justify-content: space-between; margin-bottom: 0.75rem; }
              .row-label { color: #64748b; }
              .row-value { font-weight: 500; color: #1e293b; }
              .property-image { width: 100%; height: 180px; object-fit: cover; border-radius: 0.5rem; margin-bottom: 1rem; }
              .footer { margin-top: 2rem; padding-top: 1.5rem; text-align: center; font-size: 0.875rem; color: #64748b; border-top: 1px solid #e2e8f0; }
              .status-badge { padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 500; }
              .status-completed { background: #dcfce7; color: #166534; }
              .status-pending { background: #fef9c3; color: #854d0e; }
              .status-failed { background: #fee2e2; color: #991b1b; }
            </style>
          </head>
          <body>
            <div class="receipt-container">
              ${receiptRef.current.innerHTML}
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  window.close();
                }, 200);
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleDownloadReceipt = async () => {
    if (!receiptRef.current) return;

    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`receipt-${transaction?.transactionId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!transaction) {
    return <div className="container mx-auto py-8">Transaction not found</div>;
  }

  const property = typeof transaction.property === 'object' ? 
    transaction.property : null;

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      default: return 'status-failed';
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href="/user/transactions">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Transactions
          </Button>
        </Link>
      </div>

      {/* Receipt section for printing/downloading */}
      <div ref={receiptRef} className="hidden print:block">
        <div className="p-8 bg-white rounded-lg max-w-2xl mx-auto">
          <div className="header">
            <div className="logo">PropertyPro</div>
            <h1 className="receipt-title">Payment Receipt</h1>
            <p className="receipt-id">Transaction #{transaction.transactionId}</p>
          </div>

          {property?.images?.[0] && (
            <Image 
            width={200}
            height={150}
              src={property.images[0].url} 
              alt={property.title} 
              className="property-image"
              crossOrigin="anonymous" // Important for images in PDF generation
            />
          )}

          <div className="section">
            <h2 className="section-title">Transaction Details</h2>
            <div className="space-y-3">
              <div className="row">
                <span className="row-label">Date:</span>
                <span className="row-value">{new Date(transaction?.createdAt)?.toLocaleString()}</span>
              </div>
              <div className="row">
                <span className="row-label">Status:</span>
                <span className={`status-badge ${getStatusBadgeClass(transaction.status)}`}>
                  {transaction.status}
                </span>
              </div>
              <div className="row">
                <span className="row-label">Amount:</span>
                <span className="row-value">${transaction?.amount?.toLocaleString()}</span>
              </div>
              <div className="row">
                <span className="row-label">Payment Method:</span>
                <span className="row-value capitalize">{transaction.paymentMethod}</span>
              </div>
            </div>
          </div>

          {property && (
            <div className="section">
              <h2 className="section-title">Property Information</h2>
              <div className="space-y-3">
                <div className="row">
                  <span className="row-label">Property:</span>
                  <span className="row-value">{property.title}</span>
                </div>
                <div className="row">
                  <span className="row-label">Type:</span>
                  <span className="row-value capitalize">{property.type}</span>
                </div>
                <div className="row">
                  <span className="row-label">Price:</span>
                  <span className="row-value">${property.price?.toLocaleString()}</span>
                </div>
                <div className="row">
                  <span className="row-label">Address:</span>
                  <span className="row-value text-right">{property.location?.formattedAddress}</span>
                </div>
              </div>
            </div>
          )}

          <div className="footer">
            <p>Thank you for your business!</p>
            <p className="mt-1">For any questions, please contact our support team.</p>
            <p className="mt-2 text-xs">PropertyPro Inc. • support@propertypro.com</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Transaction Information</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span>{transaction.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge 
                    variant={
                      transaction.status === 'completed' ? 'default' : 
                      transaction.status === 'pending' ? 'secondary' : 'destructive'
                    }
                  >
                    {transaction.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span>${transaction?.amount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="capitalize">{transaction.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span>{new Date(transaction?.createdAt)?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {property && (
              <div>
                <h3 className="text-lg font-medium mb-4">Property Information</h3>
                {property.images?.[0] && (
                  <Image 
                  width={200}
                  height={150}
                    src={property.images[0].url} 
                    alt={property.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Property</span>
                    <span>{property.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="capitalize">{property.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <span>${property.price?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bedrooms</span>
                    <span>{property.bedrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bathrooms</span>
                    <span>{property.bathrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address</span>
                    <span className="text-right">{property.location?.formattedAddress}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator className="my-6" />

          {property && (
            <div>
              <h3 className="text-lg font-medium mb-4">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities?.map((amenity, index) => (
                  <Badge key={index} variant="outline">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-end gap-2">
        <Button onClick={handlePrintReceipt} variant="outline">
          Print Receipt
        </Button>
        {transaction.status === 'pending' && (
          <Button>Complete Payment</Button>
        )}
      </div>
    </div>
  );
}