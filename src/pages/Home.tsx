import { useState, useEffect, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import {
  FaHeading, FaSubscript, FaTimes,
  FaYoutube, FaThumbsUp, FaComment,
  FaWhatsapp, FaUsers, FaEnvelope,
  FaTelegram,
  FaTiktok,
  FaGlobe,
  FaInstagram,
  FaFacebook,
  FaLink,
  FaPlus,
  FaMinus,
  FaEye,
  FaLock,
  FaStickyNote,
  FaCalendarAlt,
  FaImage,
  FaArrowRight,
  FaCopy
} from "react-icons/fa";
import { IconType } from "react-icons";
import { motion, MotionProps } from "framer-motion";

// API URL and Token
const API_URL = "https://myapi.ytsubunlock.my.id/api.php";
const API_TOKEN = "AgungDeveloper";
const IMGBB_API_KEY = "54e38a2c97e1a04f6860fb07718272be";
const IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload?expiration=600&key=" + IMGBB_API_KEY;

// Tipe untuk FormData
interface FormData {
  title?: string;
  subtitle?: string;
  buttonName?: string;
  targetLinks: { [key: string]: string };
  [key: string]: any;
}

// Tipe untuk Modal
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-purple-700 max-w-md w-full">
        {children}
        <button
          onClick={onClose}
          className="mt-4 bg-purple-700 hover:bg-purple-600 text-white py-2 px-4 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Tipe untuk AnimatedInput
interface AnimatedInputProps {
  icon: IconType;
  placeholder: string;
  onRemove?: () => void;
  type?: string;
  accept?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  value?: string;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  icon: Icon,
  placeholder,
  onRemove,
  type = "text",
  accept,
  onChange,
  disabled,
  value,
}) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="relative"
  >
    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
    <input
      type={type}
      placeholder={placeholder}
      accept={accept}
      onChange={onChange}
      disabled={disabled}
      value={value}
      className="w-full pl-10 pr-10 py-2 bg-gray-700 text-white border border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 disabled:opacity-50"
    />
    {onRemove && (
      <button
        onClick={onRemove}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-400"
      >
        <FaTimes className="w-4 h-4" />
      </button>
    )}
  </motion.div>
);

// Tipe untuk AnimatedButton
interface AnimatedButtonProps {
  text: string;
  icon: IconType;
  fullWidth?: boolean;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  text,
  icon: Icon,
  fullWidth = false,
  onClick,
  isActive = false,
  disabled = false,
}) => (
  <motion.button
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    whileHover={{ scale: disabled ? 1 : 1.05 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className={`${
      isActive ? "bg-gray-600 hover:bg-gray-500" : "bg-purple-700 hover:bg-purple-600"
    } text-white font-medium py-2 px-3 rounded-md shadow-sm flex items-center justify-between transition-colors duration-200 text-sm ${
      fullWidth ? "col-span-2 md:col-span-3" : ""
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    onClick={onClick}
    disabled={disabled}
  >
    <div className="flex items-center">
      {Icon && <Icon className="mr-1.5 w-3 h-3" />} {text}
    </div>
    {text !== "Generate Link" && text !== "Preview" && (
      isActive ? (
        <FaMinus className="w-3 h-3" />
      ) : (
        <FaPlus className="w-3 h-3" />
      )
    )}
  </motion.button>
);

// Tipe untuk PlatformInputs
interface PlatformInputsProps {
  platform: string;
  onInputChange: (platform: string, key: string, value: string) => void;
  uploadImage: (platform: string, key: string, file: File) => void;
}

const PlatformInputs: React.FC<PlatformInputsProps> = ({ platform, onInputChange, uploadImage }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const platformConfigs: {
    [key: string]: {
      options: string[];
      inputs: {
        [key: string]: {
          icon: IconType;
          placeholder: string;
          key: string;
          type?: string;
          accept?: string;
        };
      };
    };
  } = {
    YouTube: {
      options: ["Subscribe", "Like", "Comment"],
      inputs: {
        Subscribe: { icon: FaYoutube, placeholder: "Enter YouTube Channel URL", key: "subs" },
        Like: { icon: FaThumbsUp, placeholder: "Enter YouTube Video URL", key: "like" },
        Comment: { icon: FaComment, placeholder: "Enter YouTube Video URL", key: "comm" },
      },
    },
    WhatsApp: {
      options: ["Message", "Group Invite"],
      inputs: {
        Message: { icon: FaEnvelope, placeholder: "Enter Phone Number", key: "msg" },
        "Group Invite": { icon: FaUsers, placeholder: "Enter Group Invite Link", key: "grp" },
      },
    },
    Telegram: {
      options: ["Join Channel", "Message"],
      inputs: {
        "Join Channel": { icon: FaUsers, placeholder: "Enter Telegram Channel Link", key: "chan" },
        Message: { icon: FaEnvelope, placeholder: "Enter Telegram Username", key: "msg" },
      },
    },
    TikTok: {
      options: ["Follow", "Like Video"],
      inputs: {
        Follow: { icon: FaTiktok, placeholder: "Enter TikTok Username", key: "flw" },
        "Like Video": { icon: FaThumbsUp, placeholder: "Enter TikTok Video URL", key: "like" },
      },
    },
    Website: {
      options: ["Visit"],
      inputs: {
        Visit: { icon: FaGlobe, placeholder: "Enter Website URL", key: "visit" },
      },
    },
    Instagram: {
      options: ["Follow", "Like Post"],
      inputs: {
        Follow: { icon: FaInstagram, placeholder: "Enter Instagram Username", key: "flw" },
        "Like Post": { icon: FaThumbsUp, placeholder: "Enter Instagram Post URL", key: "like" },
      },
    },
    Facebook: {
      options: ["Like Page", "Join Group"],
      inputs: {
        "Like Page": { icon: FaThumbsUp, placeholder: "Enter Facebook Page URL", key: "like" },
        "Join Group": { icon: FaUsers, placeholder: "Enter Facebook Group URL", key: "grp" },
      },
    },
    "Target Link": {
      options: ["Link 2", "Link 3", "Link 4"],
      inputs: {
        "Link 2": { icon: FaLink, placeholder: "Enter Target Link 2 URL", key: "tlink2" },
        "Link 3": { icon: FaLink, placeholder: "Enter Target Link 3 URL", key: "tlink3" },
        "Link 4": { icon: FaLink, placeholder: "Enter Target Link 4 URL", key: "tlink4" },
      },
    },
    "Advance Option": {
      options: ["Password", "Note", "Expired", "Thumbnails"],
      inputs: {
        Password: { icon: FaLock, placeholder: "Enter Password", key: "pass" },
        Note: { icon: FaStickyNote, placeholder: "Enter Note", key: "note" },
        Expired: { icon: FaCalendarAlt, placeholder: "Select Expiration Date", type: "date", key: "exp" },
        Thumbnails: {
          icon: FaImage,
          placeholder: "Upload Thumbnail (Image Only)",
          type: "file",
          accept: "image/*",
          key: "thumb",
        },
      },
    },
  };

  const config = platformConfigs[platform] || { options: [], inputs: {} };
  const availableOptions = config.options || [];

  const addOption = (option: string) => {
    if (option && !selectedOptions.includes(option)) {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const removeOption = (option: string) => {
    setSelectedOptions(selectedOptions.filter((opt) => opt !== option));
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-6 bg-gray-700 p-4 rounded-lg border border-purple-600"
    >
      <h2 className="text-xl font-bold text-white mb-4 text-center">{platform}</h2>
      <select
        value=""
        onChange={(e) => addOption(e.target.value)}
        className="w-full p-2 mb-4 bg-gray-600 text-white border border-purple-500 rounded-md"
      >
        <option value="">Add an option</option>
        {availableOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {selectedOptions.map((option) => {
        const inputConfig = config.inputs[option] || { icon: FaLink, placeholder: "Enter URL", key: option.toLowerCase() };
        return (
          <div key={option} className="mb-4">
            <AnimatedInput
              icon={inputConfig.icon}
              placeholder={inputConfig.placeholder}
              type={inputConfig.type || "text"}
              accept={inputConfig.accept}
              onChange={(e) => {
                if (inputConfig.key === "thumb" && e.target.files) {
                  uploadImage(platform, inputConfig.key, e.target.files[0]);
                } else {
                  onInputChange(platform, inputConfig.key, e.target.value);
                }
              }}
              onRemove={() => removeOption(option)}
            />
          </div>
        );
      })}
    </motion.div>
  );
};

// Komponen Utama
const Home: React.FC = () => {
  const [activePlatforms, setActivePlatforms] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({ targetLinks: {} });
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedKey, setGeneratedKey] = useState<string>("");
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "" | "loading" | "success" | "error";
    message: string;
  }>({
    isOpen: false,
    type: "",
    message: "",
  });
  const [previewModalOpen, setPreviewModalOpen] = useState<boolean>(false);

  const socialButtons: { text: string; icon: IconType }[] = [
    { text: "YouTube", icon: FaYoutube },
    { text: "WhatsApp", icon: FaWhatsapp },
    { text: "Telegram", icon: FaTelegram },
    { text: "TikTok", icon: FaTiktok },
    { text: "Website", icon: FaGlobe },
    { text: "Instagram", icon: FaInstagram },
    { text: "Facebook", icon: FaFacebook },
    { text: "Target Link", icon: FaLink },
    { text: "Advance Option", icon: FaLink },
  ];

  const handleInputChange = (platform: string, key: string, value: string) => {
    setFormData((prev) => {
      if (platform === "Target Link") {
        return {
          ...prev,
          targetLinks: {
            ...prev.targetLinks,
            [key]: value,
          },
        };
      }
      return {
        ...prev,
        [platform]: {
          ...(prev[platform] || {}),
          [key]: value,
        },
      };
    });
  };

  const handleTopLevelInputChange = (key: string, value: string) => {
    setFormData((prev) => {
      if (key === "tlink1") {
        return {
          ...prev,
          targetLinks: {
            ...prev.targetLinks,
            [key]: value,
          },
        };
      }
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const uploadImageToImgBB = async (platform: string, key: string, file: File) => {
    setModalState({ isOpen: true, type: "loading", message: "Uploading thumbnail..." });

    const formDataImgBB = new FormData();
    formDataImgBB.append("image", file);

    try {
      const response = await fetch(IMGBB_UPLOAD_URL, {
        method: "POST",
        body: formDataImgBB,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const imageUrl = result.data.url;
        handleInputChange(platform, key, imageUrl);
        setModalState({
          isOpen: true,
          type: "success",
          message: "Thumbnail uploaded successfully!",
        });
        setTimeout(() => {
          setModalState({ isOpen: false, type: "", message: "" });
        }, 2000);
      } else {
        throw new Error(result.error?.message || "Image upload failed");
      }
    } catch (error) {
      setModalState({
        isOpen: true,
        type: "error",
        message: `Error: ${(error as Error).message}`,
      });
    }
  };

  const generateLink = async () => {
    setLoading(true);
    setGeneratedKey("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setGeneratedKey(result.key);
      } else {
        throw new Error(result.error || "Failed to generate link");
      }
    } catch (error) {
      setGeneratedKey("");
      setModalState({
        isOpen: true,
        type: "error",
        message: `Error: ${(error as Error).message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const fullUrl = `${window.location.protocol}//${window.location.hostname}/${generatedKey}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setModalState({
        isOpen: true,
        type: "success",
        message: "Link copied to clipboard!",
      });
      setTimeout(() => setModalState({ isOpen: false, type: "", message: "" }), 2000);
    }).catch((err) => {
      setModalState({
        isOpen: true,
        type: "error",
        message: "Failed to copy link!",
      });
    });
  };

  const togglePlatform = (platform: string) => {
    setActivePlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: "", message: "" });
  };

  const closePreviewModal = () => {
    setPreviewModalOpen(false);
  };

  const showPreview = () => {
    setPreviewModalOpen(true);
  };

  const getIconForAction = (platform: string, action: string): IconType => {
    const iconMap: { [key: string]: IconType } = {
      'YouTube-subs': FaYoutube,
      'YouTube-like': FaThumbsUp,
      'YouTube-comm': FaComment,
      'WhatsApp-grp': FaUsers,
      'WhatsApp-msg': FaEnvelope,
      'Telegram-chan': FaTelegram,
      'Telegram-msg': FaEnvelope,
      'TikTok-flw': FaTiktok,
      'TikTok-like': FaThumbsUp,
      'Website-visit': FaGlobe,
      'Instagram-flw': FaInstagram,
      'Instagram-like': FaThumbsUp,
      'Facebook-like': FaFacebook,
      'Facebook-grp': FaUsers,
    };
    return iconMap[`${platform}-${action}`] || FaLink;
  };

  const getButtonText = (platform: string, action: string, buttonName?: string): string => {
    const textMap: { [key: string]: string } = {
      'YouTube-subs': 'Subscribe Channel',
      'YouTube-like': 'Like Video',
      'YouTube-comm': 'Comment Video',
      'WhatsApp-grp': 'Join Group',
      'WhatsApp-msg': 'Send Message',
      'Telegram-chan': 'Join Channel',
      'Telegram-msg': 'Send Message',
      'TikTok-flw': 'Follow Account',
      'TikTok-like': 'Like Video',
      'Website-visit': 'Visit Website',
      'Instagram-flw': 'Follow Account',
      'Instagram-like': 'Like Post',
      'Facebook-like': 'Like Page',
      'Facebook-grp': 'Join Group',
    };
    if (platform === 'Target') {
      return `${buttonName || 'Get Link'} ${action.replace('tlink', ' ')}`;
    }
    return textMap[`${platform}-${action}`] || `${platform} - ${action}`;
  };

  const socialPlatforms = ['YouTube', 'WhatsApp', 'Telegram', 'TikTok', 'Website', 'Instagram', 'Facebook'];
  const socialButtonsPreview = socialPlatforms.flatMap((platform) =>
    formData[platform]
      ? Object.entries(formData[platform]).map(([action, url]) => ({ platform, action, url: url as string }))
      : []
  );
  const targetButtonsPreview = formData.targetLinks
    ? Object.entries(formData.targetLinks).map(([key, url]) => ({ platform: 'Target', action: key, url: url as string }))
    : [];
  const thumbnail = formData["Advance Option"]?.thumb;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6 text-white min-h-screen flex flex-col"
    >
      <div className="max-w-3xl mx-auto flex-grow">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-purple-700">
          <div className="mb-6 space-y-4">
            <AnimatedInput
              icon={FaHeading}
              placeholder="Enter Title"
              onChange={(e) => handleTopLevelInputChange("title", e.target.value)}
              disabled={loading}
            />
            <AnimatedInput
              icon={FaSubscript}
              placeholder="Enter Subtitle (optional)"
              onChange={(e) => handleTopLevelInputChange("subtitle", e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {socialButtons.map(({ text, icon }) => (
              <AnimatedButton
                key={text}
                text={text}
                icon={icon}
                isActive={activePlatforms.includes(text)}
                onClick={() => togglePlatform(text)}
                fullWidth={text === "Advance Option"}
                disabled={loading}
              />
            ))}
          </div>

          {activePlatforms.map((platform) => (
            <PlatformInputs
              key={platform}
              platform={platform}
              onInputChange={handleInputChange}
              uploadImage={uploadImageToImgBB}
            />
          ))}

          <div className="space-y-4 mb-6 mt-6">
            <AnimatedInput
              icon={FaLink}
              placeholder="Enter Button Name (optional)"
              onChange={(e) => handleTopLevelInputChange("buttonName", e.target.value)}
              disabled={loading}
            />
            <AnimatedInput
              icon={FaLink}
              placeholder="Enter Target Link"
              onChange={(e) => handleTopLevelInputChange("tlink1", e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex justify-between gap-3">
            <AnimatedButton
              text={loading ? "Generating..." : "Generate Link"}
              icon={FaLink}
              onClick={generateLink}
              disabled={loading}
            />
            <AnimatedButton
              text="Preview"
              icon={FaEye}
              onClick={showPreview}
              disabled={loading}
            />
          </div>

          {generatedKey && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-4 flex items-center"
            >
              <div className="relative flex-grow">
                <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="text"
                  value={`${window.location.protocol}//${window.location.hostname}/${generatedKey}`}
                  readOnly
                  className="w-full pl-10 pr-10 py-2 bg-gray-700 text-white border border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={copyToClipboard}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300"
                >
                  <FaCopy className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Modal isOpen={modalState.isOpen} onClose={closeModal}>
        {modalState.type === "loading" && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p>{modalState.message}</p>
          </div>
        )}
        {modalState.type === "success" && (
          <div className="text-center">
            <div className="text-green-500 text-4xl mb-4">✔</div>
            <p>{modalState.message}</p>
          </div>
        )}
        {modalState.type === "error" && (
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">✖</div>
            <p>{modalState.message}</p>
          </div>
        )}
      </Modal>

      <Modal isOpen={previewModalOpen} onClose={closePreviewModal}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Preview</h2>
          <div className="w-full mb-4 bg-gray-700 p-4 rounded-xl shadow-lg border border-purple-600 text-center">
            <h1 className="text-xl font-bold mb-2">{formData.title || "Untitled"}</h1>
            <p className="text-base text-gray-300">{formData.subtitle || "No subtitle"}</p>
          </div>

          {thumbnail && (
            <div className="w-full mb-4 bg-gray-700 p-4 rounded-xl shadow-lg border border-purple-600 text-center">
              <h2 className="text-lg font-bold mb-2">Thumbnail</h2>
              <img
                src={thumbnail}
                alt="Thumbnail"
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}

          <div className="w-full space-y-3">
            {socialButtonsPreview.map(({ platform, action, url }, index) => {
              const Icon = getIconForAction(platform, action);
              return (
                <div
                  key={`${platform}-${action}`}
                  className="w-full flex items-center justify-between bg-purple-600 text-white py-3 px-5 rounded-full shadow-md"
                  style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)' }}
                >
                  <div className="flex items-center">
                    <Icon className="mr-3 text-lg" /> {getButtonText(platform, action)}
                  </div>
                  <div className="p-2 rounded-full bg-opacity-20 bg-white">
                    <FaArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              );
            })}

            {targetButtonsPreview.map(({ action, url }) => (
              <div
                key={`Target-${action}`}
                className="w-full flex items-center justify-between bg-gray-600 text-white py-3 px-5 rounded-full shadow-md"
                style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)' }}
              >
                <div className="flex items-center">
                  <FaLink className="mr-3 text-lg" /> {getButtonText('Target', action, formData.buttonName)}
                </div>
                <div className="p-2 rounded-full bg-opacity-20 bg-white">
                  <FaArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      <footer className="mt-8 bg-gray-900 py-6 border-t border-purple-700">
        <div className="max-w-3xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-4 md:mb-0">
            <Link
              to="/terms-and-conditions"
              className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy-policy"
              className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              to="/about-us"
              className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
            >
              Contact
            </Link>
          </div>
          <div className="flex gap-4">
            <a
              href="https://t.me/subs4unlock"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
            >
              <FaTelegram className="w-6 h-6" />
            </a>
            <a
              href="https://wa.me/62881037428871"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
            >
              <FaWhatsapp className="w-6 h-6" />
            </a>
            <a
              href="https://youtube.com/@subs4unlock"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
            >
              <FaYoutube className="w-6 h-6" />
            </a>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

export default Home;