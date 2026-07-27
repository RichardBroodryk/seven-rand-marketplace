import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Heading,
  Input,
  PrimaryButton,
  Select,
  TextArea,
  ImageUploader,
} from "../components/ui";

import { listingsService } from "../services/listingsService";
import { API_CONFIG } from "../config/api";

import styles from "./PostListingPage.module.css";

interface ListingForm {
  category_id: string;
  title: string;
  description: string;
  price: string;
  province: string;
  city: string;
}

interface FormErrors {
  category_id?: string;
  title?: string;
  description?: string;
  price?: string;
  province?: string;
  city?: string;
}

interface CreateListingResponse {
  success: boolean;
  message?: string;
  listingId?: string;
  data?: {
    listingId?: string;
    id?: string;
  };
}

interface UploadedImage {
  id?: string;
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

const initialForm: ListingForm = {
  category_id: "",
  title: "",
  description: "",
  price: "",
  province: "",
  city: "",
};

export default function PostListingPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<ListingForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [listingId, setListingId] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.category_id) {
      newErrors.category_id = "Please select a category";
    }

    if (!form.title.trim() || form.title.trim().length < 10) {
      newErrors.title = "Title must be at least 10 characters";
    } else if (form.title.trim().length > 100) {
      newErrors.title = "Title must not exceed 100 characters";
    }

    if (!form.description.trim() || form.description.trim().length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    } else if (form.description.trim().length > 2000) {
      newErrors.description = "Description must not exceed 2000 characters";
    }

    if (!form.price) {
      newErrors.price = "Price is required";
    } else if (Number(form.price) <= 0) {
      newErrors.price = "Price must be greater than R0";
    } else if (isNaN(Number(form.price))) {
      newErrors.price = "Please enter a valid price";
    }

    if (!form.province.trim()) {
      newErrors.province = "Province is required";
    }

    if (!form.city.trim()) {
      newErrors.city = "City is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    if (submitError) {
      setSubmitError(null);
    }

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Updated sellerFee logic to include all premium categories
  const sellerFee =
    form.category_id === "1" ||  // Vehicles
    form.category_id === "2" ||  // Property
    form.category_id === "3" ||  // Commercial Equipment
    form.category_id === "15" || // Farming
    form.category_id === "16" || // Business & Industrial
    form.category_id === "17" || // Boating & Marine
    form.category_id === "18" || // Trucks & Heavy Vehicles
    form.category_id === "19" || // Caravans & Camping
    form.category_id === "21"    // Trailers
      ? 14
      : 7;

  const handleImageUploadSuccess = (images: UploadedImage[]) => {
    setUploadedImages(images);
    setUploadError(null);
    console.log("✅ Images uploaded:", images);
  };

  const handleImageUploadError = (error: string) => {
    setUploadError(error);
    console.error("❌ Image upload error:", error);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSubmitError(null);
    setSubmitSuccess(null);
    setListingId(null);

    if (!validateForm()) {
      const firstErrorField = document.querySelector(
        `[data-error="true"]`
      );
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setSubmitError("Hey there! Please sign in before posting an advert.");
      return;
    }

    try {
      setLoading(true);

      // ✅ Step 1: Create the listing
      const response = (await listingsService.createListing(
        {
          category_id: Number(form.category_id),
          title: form.title.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          province: form.province.trim(),
          city: form.city.trim(),
        },
        token
      )) as CreateListingResponse;

      console.log("🔍 Full response from createListing:", response);

      const id = response.data?.listingId || 
                 response.data?.id || 
                 response.listingId ||
                 null;

      console.log("🔍 Extracted ID:", id);
      
      if (id) {
        setListingId(id);
        console.log("✅ Listing ID set to state:", id);
        
        // ✅ Step 2: Link uploaded images to the listing
        if (uploadedImages.length > 0) {
          try {
            const imageIds = uploadedImages
              .filter(img => img.id)
              .map(img => img.id);
            
            if (imageIds.length > 0) {
              const linkResponse = await fetch(
                `${API_CONFIG.BASE_URL}/uploads/link-images`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    listingId: id,
                    imageIds: imageIds,
                  }),
                }
              );
              
              if (!linkResponse.ok) {
                console.warn("Failed to link images to listing:", await linkResponse.text());
              } else {
                console.log("✅ Images linked to listing successfully");
              }
            }
          } catch (linkError) {
            console.warn("Error linking images:", linkError);
          }
        }
        
        setSubmitSuccess(
          "Your listing is ready! Now let's get it published."
        );
        setForm(initialForm);
        setUploadedImages([]);
      } else {
        console.error("❌ No ID found in response!");
        setSubmitSuccess("Listing created successfully.");
        setForm(initialForm);
        setUploadedImages([]);
      }
    } catch (error) {
      console.error("❌ Error creating listing:", error);
      if (error instanceof Error) {
        setSubmitError("We couldn't create your listing. Let's check the details and try again.");
      } else {
        setSubmitError("Unable to create listing. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    console.log("🔍 Navigate to checkout with ID:", listingId);
    if (listingId) {
      navigate(`/checkout/${listingId}`);
    } else {
      console.error("❌ No listing ID available for checkout");
    }
  };

  return (
    <Container size="large">
      <div className={styles.page}>
        <div className={styles.header}>
          <Heading as="h1" size="xl">
            Post an Ad
          </Heading>

          <p className={styles.subtitle}>
            Complete the details below to prepare your advert.
            Checkout and publication follow in the next step.
          </p>
        </div>

        {submitError && (
          <div className={styles.errorBox} role="alert">
            <strong>Let's fix that:</strong> {submitError}
          </div>
        )}

        {submitSuccess && (
          <div className={styles.successBox} role="status">
            <p className={styles.successText}>
              <strong>Great!</strong> {submitSuccess}
            </p>
            {listingId && (
              <PrimaryButton
                onClick={handleCheckout}
                className={styles.checkoutButton}
              >
                Continue to Checkout
              </PrimaryButton>
            )}
          </div>
        )}

        {!submitSuccess && (
          <form
            className={styles.form}
            onSubmit={handleSubmit}
            noValidate
          >
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                Listing Details
              </h2>

              <Select
                id="category_id"
                name="category_id"
                label="Category"
                required
                value={form.category_id}
                onChange={handleChange}
                error={errors.category_id}
                data-error={!!errors.category_id}
              >
                <option value="">Select a category</option>
                {/* Premium Categories - R14 */}
                <option value="1">🚗 Vehicles (R14)</option>
                <option value="2">🏡 Property (R14)</option>
                <option value="3">🏗️ Commercial Equipment (R14)</option>
                <option value="15">🚜 Farming (R14)</option>
                <option value="16">📦 Business & Industrial (R14)</option>
                <option value="17">⛵ Boating & Marine (R14)</option>
                <option value="18">🚛 Trucks & Heavy Vehicles (R14)</option>
                <option value="19">🏕️ Caravans & Camping (R14)</option>
                <option value="21">🚲 Trailers (R14)</option>
                {/* Standard Categories - R7 */}
                <option value="4">📱 Electronics (R7)</option>
                <option value="5">🪑 Furniture (R7)</option>
                <option value="6">🌿 Home & Garden (R7)</option>
                <option value="7">👗 Fashion (R7)</option>
                <option value="22">💄 Cosmetics & Beauty (R7)</option>
                <option value="8">⚽ Sports (R7)</option>
                <option value="9">📦 Other (R7)</option>
                <option value="10">💼 Jobs (R7)</option>
                <option value="11">🛠️ Services (R7)</option>
                <option value="12">🐶 Pets (R7)</option>
                <option value="13">🎮 Gaming (R7)</option>
                <option value="14">👶 Baby & Kids (R7)</option>
                <option value="20">🔧 Tools & Equipment (R7)</option>
              </Select>

              <Input
                id="title"
                name="title"
                label="Listing Title"
                required
                placeholder="Example: iPhone 15 Pro 256GB"
                value={form.title}
                onChange={handleChange}
                error={errors.title}
                data-error={!!errors.title}
              />

              <TextArea
                id="description"
                name="description"
                label="Description"
                required
                placeholder="Describe your item in detail..."
                value={form.description}
                onChange={handleChange}
                error={errors.description}
                data-error={!!errors.description}
                rows={6}
              />

              <Input
                id="price"
                name="price"
                type="number"
                label="Price (R)"
                required
                placeholder="0.00"
                value={form.price}
                onChange={handleChange}
                error={errors.price}
                data-error={!!errors.price}
                min="0.01"
                step="0.01"
              />

              <div className={styles.grid}>
                <Input
                  id="province"
                  name="province"
                  label="Province"
                  placeholder="Gauteng"
                  value={form.province}
                  onChange={handleChange}
                  error={errors.province}
                  data-error={!!errors.province}
                />

                <Input
                  id="city"
                  name="city"
                  label="City / Town"
                  placeholder="Pretoria"
                  value={form.city}
                  onChange={handleChange}
                  error={errors.city}
                  data-error={!!errors.city}
                />
              </div>
            </div>

            {/* Images Section */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Images</h2>
              <p className={styles.sectionSubtitle}>
                Upload up to 5 images of your item. First image will be the main image.
              </p>
              <ImageUploader
                maxFiles={5}
                onUploadSuccess={handleImageUploadSuccess}
                onUploadError={handleImageUploadError}
              />
              {uploadError && (
                <div className={styles.uploadError}>
                  <strong>Let's fix that:</strong> {uploadError}
                </div>
              )}
              {uploadedImages.length > 0 && (
                <div className={styles.uploadSuccess}>
                  ✅ {uploadedImages.length} image{uploadedImages.length > 1 ? "s" : ""} uploaded successfully!
                </div>
              )}
            </div>

            <aside className={styles.summary}>
              <h2>Seller Summary</h2>

              <div className={styles.summaryRow}>
                <span>Category</span>
                <strong>
                  {form.category_id === "1" && "Vehicles"}
                  {form.category_id === "2" && "Property"}
                  {form.category_id === "3" && "Commercial Equipment"}
                  {form.category_id === "4" && "Electronics"}
                  {form.category_id === "5" && "Furniture"}
                  {form.category_id === "6" && "Home & Garden"}
                  {form.category_id === "7" && "Fashion"}
                  {form.category_id === "8" && "Sports"}
                  {form.category_id === "9" && "Other"}
                  {form.category_id === "10" && "Jobs"}
                  {form.category_id === "11" && "Services"}
                  {form.category_id === "12" && "Pets"}
                  {form.category_id === "13" && "Gaming"}
                  {form.category_id === "14" && "Baby & Kids"}
                  {form.category_id === "15" && "Farming"}
                  {form.category_id === "16" && "Business & Industrial"}
                  {form.category_id === "17" && "Boating & Marine"}
                  {form.category_id === "18" && "Trucks & Heavy Vehicles"}
                  {form.category_id === "19" && "Caravans & Camping"}
                  {form.category_id === "20" && "Tools & Equipment"}
                  {form.category_id === "21" && "Trailers"}
                  {form.category_id === "22" && "Cosmetics & Beauty"}
                  {!form.category_id && "Not Selected"}
                </strong>
              </div>

              <div className={styles.summaryRow}>
                <span>Seller Fee</span>
                <strong>R{sellerFee}</strong>
              </div>

              <div className={styles.summaryRow}>
                <span>Payment</span>
                <strong>PayFast</strong>
              </div>

              <div className={styles.summaryRow}>
                <span>Listing Status</span>
                <strong>Pending Payment</strong>
              </div>

              <p className={styles.note}>
                Your advert will be published after payment has
                been successfully completed.
              </p>

              <PrimaryButton
                type="submit"
                fullWidth
                disabled={loading}
              >
                {loading
                  ? "Creating Listing..."
                  : "Continue to Checkout"}
              </PrimaryButton>
            </aside>
          </form>
        )}
      </div>
    </Container>
  );
}