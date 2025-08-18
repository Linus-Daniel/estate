import axios from "axios";

export async function fetchTotalRevenue() {
  let total = 0;
  let page = 1;
  let hasNextPage = true;

  const PAYSTACK_SECRET_KEY =
    "sk_test_d539e31fbf881b504a0db70f4be9091b52807bbe";
  if (!PAYSTACK_SECRET_KEY) {
    console.log(PAYSTACK_SECRET_KEY, "PAYSTACK KEY");
    console.error("Missing PAYSTACK_SECRET_KEY");
    return;
  }

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/totals`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    const total_volume = response.data.data.total_volume;
    console.log(total_volume);
    total = total_volume;

    return Math.round(total_volume/100) as number;
  } catch (error) {
    console.log(error);
  }

  console.log("Total Revenue (NGN): ₦" + (total / 100).toFixed(2));
}



export async function fetchTransaction() {

  const PAYSTACK_SECRET_KEY ="sk_test_d539e31fbf881b504a0db70f4be9091b52807bbe";
  if (!PAYSTACK_SECRET_KEY) {
    console.log(PAYSTACK_SECRET_KEY, "PAYSTACK KEY");
    console.error("Missing PAYSTACK_SECRET_KEY");
    return;
  }

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    const transaction = response.data;
    console.log(transaction, " Transactions");
    return transaction
  } catch (error) {
    console.log(error,"fa");
  }
}


