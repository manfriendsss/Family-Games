import { Category } from './types';

const BASE_CATEGORIES: Category[] = [
  {
    id: 'objects',
    name: 'Đồ vật hàng ngày',
    icon: '🏠',
    pairs: [
      { citizen: 'Gấu bông', imposter_hint: 'Búp bê', difficulty: 'VERY_EASY' },
      { citizen: 'Cái cốc', imposter_hint: 'Cái bát', difficulty: 'VERY_EASY' },
      { citizen: 'Cái mũ', imposter_hint: 'Cái ô', difficulty: 'VERY_EASY' },
      { citizen: 'Bàn chải răng', imposter_hint: 'Khăn mặt', difficulty: 'EASY' },
      { citizen: 'Cặp sách', imposter_hint: 'Hộp bút', difficulty: 'EASY' },
      { citizen: 'Đèn học', imposter_hint: 'Đèn ngủ', difficulty: 'EASY' },
      { citizen: 'Quyển truyện', imposter_hint: 'Quyển vở', difficulty: 'EASY' },
      { citizen: 'Cái gương', imposter_hint: 'Cửa sổ', difficulty: 'HARD' },
      { citizen: 'Cái đồng hồ', imposter_hint: 'Cái điện thoại', difficulty: 'HARD' },
      { citizen: 'Đôi giày', imposter_hint: 'Đôi dép', difficulty: 'VERY_EASY' },
      { citizen: 'Chìa khóa', imposter_hint: 'Ổ khóa', difficulty: 'EASY' },
      { citizen: 'Thắt lưng', imposter_hint: 'Cà vạt', difficulty: 'HARD' },
      { citizen: 'Máy giặt', imposter_hint: 'Tủ lạnh', difficulty: 'EASY' },
      { citizen: 'Lò vi sóng', imposter_hint: 'Bếp ga', difficulty: 'HARD' },
      { citizen: 'Tivi', imposter_hint: 'Máy tính', difficulty: 'EASY' }
    ]
  },
  {
    id: 'foods',
    name: 'Ẩm thực',
    icon: '🍕',
    pairs: [
      { citizen: 'Kẹo mút', imposter_hint: 'Kẹo cao su', difficulty: 'VERY_EASY' },
      { citizen: 'Kem ốc quế', imposter_hint: 'Sữa chua', difficulty: 'VERY_EASY' },
      { citizen: 'Pizza', imposter_hint: 'Bánh mì kẹp', difficulty: 'EASY' },
      { citizen: 'Xúc xích', imposter_hint: 'Lạp xưởng', difficulty: 'EASY' },
      { citizen: 'Trà sữa', imposter_hint: 'Nước cam', difficulty: 'EASY' },
      { citizen: 'Bánh ngọt', imposter_hint: 'Bánh quy', difficulty: 'EASY' },
      { citizen: 'Đùi gà rán', imposter_hint: 'Khoai tây chiên', difficulty: 'VERY_EASY' },
      { citizen: 'Quả táo', imposter_hint: 'Quả lê', difficulty: 'VERY_EASY' },
      { citizen: 'Sữa tươi', imposter_hint: 'Nước ép', difficulty: 'VERY_EASY' },
      { citizen: 'Phở', imposter_hint: 'Bún chả', difficulty: 'HARD' },
      { citizen: 'Lẩu', imposter_hint: 'Nướng', difficulty: 'HARD' },
      { citizen: 'Rượu vang', imposter_hint: 'Bia', difficulty: 'HARD' },
      { citizen: 'Sầu riêng', imposter_hint: 'Quả mít', difficulty: 'EASY' },
      { citizen: 'Hành tây', imposter_hint: 'Tỏi', difficulty: 'HARD' },
      { citizen: 'Muối', imposter_hint: 'Đường', difficulty: 'HARD' }
    ]
  },
  {
    id: 'animals',
    name: 'Động vật',
    icon: '🦁',
    pairs: [
      { citizen: 'Con mèo', imposter_hint: 'Con hổ', difficulty: 'VERY_EASY' },
      { citizen: 'Con sư tử', imposter_hint: 'Con báo', difficulty: 'EASY' },
      { citizen: 'Con voi', imposter_hint: 'Con hà mã', difficulty: 'EASY' },
      { citizen: 'Con khỉ', imposter_hint: 'Con đười ươi', difficulty: 'EASY' },
      { citizen: 'Cá vàng', imposter_hint: 'Cá chép', difficulty: 'VERY_EASY' },
      { citizen: 'Con gà', imposter_hint: 'Con vịt', difficulty: 'VERY_EASY' },
      { citizen: 'Con thỏ', imposter_hint: 'Con chuột', difficulty: 'VERY_EASY' },
      { citizen: 'Con chó', imposter_hint: 'Con sói', difficulty: 'EASY' },
      { citizen: 'Con hươu cao cổ', imposter_hint: 'Con ngựa vằn', difficulty: 'HARD' },
      { citizen: 'Cá mập', imposter_hint: 'Cá voi', difficulty: 'EASY' },
      { citizen: 'Con kiến', imposter_hint: 'Con gián', difficulty: 'HARD' },
      { citizen: 'Con ong', imposter_hint: 'Con bướm', difficulty: 'HARD' },
      { citizen: 'Đà điểu', imposter_hint: 'Chim cánh cụt', difficulty: 'HARD' },
      { citizen: 'Rùa', imposter_hint: 'Ốc sên', difficulty: 'EASY' },
      { citizen: 'Con rắn', imposter_hint: 'Lươn', difficulty: 'HARD' }
    ]
  },
  {
    id: 'entertainment',
    name: 'Giải trí & Phim ảnh',
    icon: '🎭',
    pairs: [
      { citizen: 'Doraemon', imposter_hint: 'Nobita', difficulty: 'VERY_EASY' },
      { citizen: 'Người Nhện', imposter_hint: 'Người Sắt', difficulty: 'EASY' },
      { citizen: 'Elsa', imposter_hint: 'Anna', difficulty: 'VERY_EASY' },
      { citizen: 'YouTube', imposter_hint: 'TikTok', difficulty: 'EASY' },
      { citizen: 'Rạp chiếu phim', imposter_hint: 'Sân khấu kịch', difficulty: 'HARD' },
      { citizen: 'Ca sĩ', imposter_hint: 'Diễn viên', difficulty: 'EASY' },
      { citizen: 'Harry Potter', imposter_hint: 'Chúa tể nhẫn', difficulty: 'HARD' },
      { citizen: 'Guitar', imposter_hint: 'Piano', difficulty: 'EASY' },
      { citizen: 'Nhiếp ảnh', imposter_hint: 'Hội họa', difficulty: 'HARD' },
      { citizen: 'Đàn bầu', imposter_hint: 'Đàn tranh', difficulty: 'HARD' },
      { citizen: 'Marvel', imposter_hint: 'DC Comics', difficulty: 'HARD' },
      { citizen: 'Superman', imposter_hint: 'Batman', difficulty: 'EASY' },
      { citizen: 'Netflix', imposter_hint: 'Disney+', difficulty: 'EASY' },
      { citizen: 'Nhạc trẻ', imposter_hint: 'Nhạc Rock', difficulty: 'EASY' },
      { citizen: 'K-pop', imposter_hint: 'V-pop', difficulty: 'EASY' }
    ]
  },
  {
    id: 'knowledge',
    name: 'Kiến thức & Đời sống',
    icon: '📚',
    pairs: [
      { citizen: 'Bảng đen', imposter_hint: 'Viên phấn', difficulty: 'VERY_EASY' },
      { citizen: 'Bút chì', imposter_hint: 'Bút bi', difficulty: 'VERY_EASY' },
      { citizen: 'Bác sĩ', imposter_hint: 'Y tá', difficulty: 'EASY' },
      { citizen: 'Công an', imposter_hint: 'Bộ đội', difficulty: 'EASY' },
      { citizen: 'Giáo viên', imposter_hint: 'Giảng viên', difficulty: 'HARD' },
      { citizen: 'Máy tính Casio', imposter_hint: 'Bàn tính', difficulty: 'HARD' },
      { citizen: 'Sách giáo khoa', imposter_hint: 'Từ điển', difficulty: 'EASY' },
      { citizen: 'Bản đồ', imposter_hint: 'Quả địa cầu', difficulty: 'HARD' },
      { citizen: 'Lịch vạn niên', imposter_hint: 'Đồng hồ cát', difficulty: 'HARD' },
      { citizen: 'Tiền mặt', imposter_hint: 'Thẻ ngân hàng', difficulty: 'EASY' },
      { citizen: 'Hộ chiếu', imposter_hint: 'Visa', difficulty: 'HARD' },
      { citizen: 'Email', imposter_hint: 'Thư tay', difficulty: 'EASY' },
      { citizen: 'Wifi', imposter_hint: '4G', difficulty: 'EASY' },
      { citizen: 'Trạm vũ trụ', imposter_hint: 'Vệ tinh', difficulty: 'HARD' },
      { citizen: 'Robot', imposter_hint: 'Trí tuệ nhân tạo', difficulty: 'HARD' }
    ]
  },
  {
    id: 'sports',
    name: 'Thể thao',
    icon: '⚽',
    pairs: [
      { citizen: 'Đá bóng', imposter_hint: 'Đá cầu', difficulty: 'VERY_EASY' },
      { citizen: 'Bơi lội', imposter_hint: 'Lặn biển', difficulty: 'EASY' },
      { citizen: 'Cầu lông', imposter_hint: 'Tennis', difficulty: 'EASY' },
      { citizen: 'Bóng rổ', imposter_hint: 'Bóng chuyền', difficulty: 'EASY' },
      { citizen: 'Chạy bộ', imposter_hint: 'Đi bộ', difficulty: 'VERY_EASY' },
      { citizen: 'Đạp xe', imposter_hint: 'Đua xe máy', difficulty: 'EASY' },
      { citizen: 'Tập gym', imposter_hint: 'Yoga', difficulty: 'HARD' },
      { citizen: 'Boxing', imposter_hint: 'Vật', difficulty: 'HARD' },
      { citizen: 'Golf', imposter_hint: 'Bida', difficulty: 'HARD' },
      { citizen: 'Cờ vua', imposter_hint: 'Cờ tướng', difficulty: 'EASY' },
      { citizen: 'Trượt tuyết', imposter_hint: 'Trượt băng', difficulty: 'HARD' },
      { citizen: 'Leo núi', imposter_hint: 'Điền kinh', difficulty: 'EASY' },
      { citizen: 'Bắn cung', imposter_hint: 'Bắn súng', difficulty: 'HARD' },
      { citizen: 'Lướt ván', imposter_hint: 'Chèo thuyền', difficulty: 'HARD' },
      { citizen: 'Nhảy cao', imposter_hint: 'Nhảy xa', difficulty: 'HARD' }
    ]
  },
  {
    id: 'nature',
    name: 'Thiên nhiên',
    icon: '🌳',
    pairs: [
      { citizen: 'Mặt trời', imposter_hint: 'Mặt trăng', difficulty: 'VERY_EASY' },
      { citizen: 'Cầu vồng', imposter_hint: 'Đám mây', difficulty: 'VERY_EASY' },
      { citizen: 'Trời mưa', imposter_hint: 'Trời tuyết', difficulty: 'EASY' },
      { citizen: 'Sông', imposter_hint: 'Suối', difficulty: 'HARD' },
      { citizen: 'Biển', imposter_hint: 'Đại dương', difficulty: 'HARD' },
      { citizen: 'Sa mạc', imposter_hint: 'Rừng rậm', difficulty: 'EASY' },
      { citizen: 'Sấm sét', imposter_hint: 'Gió bão', difficulty: 'EASY' },
      { citizen: 'Núi lửa', imposter_hint: 'Động đất', difficulty: 'HARD' },
      { citizen: 'Bình minh', imposter_hint: 'Hoàng hôn', difficulty: 'HARD' },
      { citizen: 'Thác nước', imposter_hint: 'Hồ nước', difficulty: 'EASY' },
      { citizen: 'Mưa đá', imposter_hint: 'Sương mù', difficulty: 'HARD' },
      { citizen: 'Rạn san hô', imposter_hint: 'Rừng ngập mặn', difficulty: 'HARD' },
      { citizen: 'Đảo', imposter_hint: 'Bán đảo', difficulty: 'HARD' },
      { citizen: 'Động thạch nhũ', imposter_hint: 'Vực thẳm', difficulty: 'HARD' },
      { citizen: 'Bắc cực', imposter_hint: 'Nam cực', difficulty: 'EASY' }
    ]
  },
  {
    id: 'games',
    name: 'Trò chơi',
    icon: '🎮',
    pairs: [
      { citizen: 'Lego', imposter_hint: 'Xếp hình', difficulty: 'VERY_EASY' },
      { citizen: 'Minecraft', imposter_hint: 'Roblox', difficulty: 'EASY' },
      { citizen: 'Liên Minh Huyền Thoại', imposter_hint: 'Liên Quân', difficulty: 'HARD' },
      { citizen: 'PUBG', imposter_hint: 'Free Fire', difficulty: 'HARD' },
      { citizen: 'Sudoku', imposter_hint: 'Giải đố', difficulty: 'HARD' },
      { citizen: 'Cá ngựa', imposter_hint: 'Ma sói', difficulty: 'EASY' },
      { citizen: 'Oẳn tù tì', imposter_hint: 'Kéo co', difficulty: 'VERY_EASY' },
      { citizen: 'Trốn tìm', imposter_hint: 'Đuổi bắt', difficulty: 'VERY_EASY' },
      { citizen: 'Cờ tỷ phú', imposter_hint: 'Cờ vây', difficulty: 'HARD' },
      { citizen: 'Bắn bi', imposter_hint: 'Đánh quay', difficulty: 'EASY' },
      { citizen: 'Diều giấy', imposter_hint: 'Chong chóng', difficulty: 'EASY' },
      { citizen: 'Xí ngầu', imposter_hint: 'Đồng xu', difficulty: 'EASY' },
      { citizen: 'Bài Uno', imposter_hint: 'Bài Tây', difficulty: 'HARD' },
      { citizen: 'Pickleball', imposter_hint: 'Tennis', difficulty: 'HARD' },
      { citizen: 'Bập bênh', imposter_hint: 'Cầu trượt', difficulty: 'VERY_EASY' }
    ]
  }
];

const BASE_CHARADES_CATEGORIES: Category[] = [
  {
    id: 'actions',
    name: 'Hành động',
    icon: '🏃',
    pairs: [
      { citizen: 'Đánh răng', imposter_hint: 'Rửa mặt', difficulty: 'VERY_EASY' },
      { citizen: 'Quét nhà', imposter_hint: 'Lau nhà', difficulty: 'VERY_EASY' },
      { citizen: 'Nấu ăn', imposter_hint: 'Rửa bát', difficulty: 'EASY' },
      { citizen: 'Ngủ gật', imposter_hint: 'Ngáp', difficulty: 'EASY' },
      { citizen: 'Bơi lội', imposter_hint: 'Chèo thuyền', difficulty: 'EASY' },
      { citizen: 'Uống trà sữa', imposter_hint: 'Ăn kem', difficulty: 'EASY' },
      { citizen: 'Chụp ảnh', imposter_hint: 'Livestream', difficulty: 'HARD' },
      { citizen: 'Tập gym', imposter_hint: 'Chạy bộ', difficulty: 'EASY' },
      { citizen: 'Đi mua sắm', imposter_hint: 'Đi ship hàng', difficulty: 'HARD' },
      { citizen: 'Lái ô tô', imposter_hint: 'Lái xe máy', difficulty: 'VERY_EASY' },
      { citizen: 'Câu cá', imposter_hint: 'Quăng chài', difficulty: 'HARD' },
      { citizen: 'Nhảy múa', imposter_hint: 'Tập thể dục', difficulty: 'EASY' },
      { citizen: 'Khóc nhè', imposter_hint: 'Cười toe toét', difficulty: 'VERY_EASY' },
      { citizen: 'Đắp mặt nạ', imposter_hint: 'Trang điểm', difficulty: 'HARD' },
      { citizen: 'Leo núi', imposter_hint: 'Đi bộ đường dài', difficulty: 'HARD' }
    ]
  },
  {
    id: 'jobs',
    name: 'Nghề nghiệp',
    icon: '👨‍🏫',
    pairs: [
      { citizen: 'Bác sĩ', imposter_hint: 'Y tá', difficulty: 'VERY_EASY' },
      { citizen: 'Giáo viên', imposter_hint: 'Học sinh', difficulty: 'VERY_EASY' },
      { citizen: 'Công an', imposter_hint: 'Tội phạm', difficulty: 'EASY' },
      { citizen: 'Đầu bếp', imposter_hint: 'Người phục vụ', difficulty: 'EASY' },
      { citizen: 'Họa sĩ', imposter_hint: 'Ca sĩ', difficulty: 'EASY' },
      { citizen: 'Thợ xây', imposter_hint: 'Kiến trúc sư', difficulty: 'HARD' },
      { citizen: 'Phi công', imposter_hint: 'Tiếp viên hàng không', difficulty: 'HARD' },
      { citizen: 'Nông dân', imposter_hint: 'Công nhân', difficulty: 'EASY' },
      { citizen: 'Lập trình viên', imposter_hint: 'Gamer', difficulty: 'HARD' },
      { citizen: 'Shipper', imposter_hint: 'Grab', difficulty: 'EASY' },
      { citizen: 'Thợ cắt tóc', imposter_hint: 'Trang điểm', difficulty: 'HARD' },
      { citizen: 'Lính cứu hỏa', imposter_hint: 'Thợ lặn', difficulty: 'HARD' },
      { citizen: 'Vận động viên', imposter_hint: 'Huấn luyện viên', difficulty: 'HARD' },
      { citizen: 'Nhà báo', imposter_hint: 'Phóng viên', difficulty: 'HARD' },
      { citizen: 'Người dẫn chương trình', imposter_hint: 'Người mẫu', difficulty: 'HARD' }
    ]
  },
  {
    id: 'animals',
    name: 'Động vật',
    icon: '🐶',
    pairs: [
      { citizen: 'Con khỉ', imposter_hint: 'Đười ươi', difficulty: 'VERY_EASY' },
      { citizen: 'Con voi', imposter_hint: 'Con hổ', difficulty: 'VERY_EASY' },
      { citizen: 'Con thỏ', imposter_hint: 'Con rùa', difficulty: 'VERY_EASY' },
      { citizen: 'Chim cánh cụt', imposter_hint: 'Vịt', difficulty: 'EASY' },
      { citizen: 'Con rắn', imposter_hint: 'Con sâu', difficulty: 'EASY' },
      { citizen: 'Con lợn', imposter_hint: 'Con bò', difficulty: 'VERY_EASY' },
      { citizen: 'Con gà trống', imposter_hint: 'Con vịt', difficulty: 'VERY_EASY' },
      { citizen: 'Con cú', imposter_hint: 'Con dơi', difficulty: 'HARD' },
      { citizen: 'Con hươu cao cổ', imposter_hint: 'Con ngựa', difficulty: 'EASY' },
      { citizen: 'Con báo', imposter_hint: 'Con mèo', difficulty: 'EASY' },
      { citizen: 'Con cá sấu', imposter_hint: 'Nòng nọc', difficulty: 'HARD' },
      { citizen: 'Con sóc', imposter_hint: 'Con chuột', difficulty: 'HARD' },
      { citizen: 'Con ong', imposter_hint: 'Con muỗi', difficulty: 'HARD' },
      { citizen: 'Con bướm', imposter_hint: 'Chuồn chuồn', difficulty: 'EASY' },
      { citizen: 'Con tôm', imposter_hint: 'Con cua', difficulty: 'EASY' }
    ]
  },
  {
    id: 'objects',
    name: 'Đồ vật',
    icon: '🏠',
    pairs: [
      { citizen: 'Cái cốc', imposter_hint: 'Cái bát', difficulty: 'VERY_EASY' },
      { citizen: 'Điện thoại', imposter_hint: 'Máy tính', difficulty: 'VERY_EASY' },
      { citizen: 'Cái gương', imposter_hint: 'Cửa sổ', difficulty: 'EASY' },
      { citizen: 'Đồng hồ', imposter_hint: 'Lịch', difficulty: 'EASY' },
      { citizen: 'Cái ô', imposter_hint: 'Áo mưa', difficulty: 'VERY_EASY' },
      { citizen: 'Chìa khóa', imposter_hint: 'Ổ khóa', difficulty: 'EASY' },
      { citizen: 'Cái giường', imposter_hint: 'Cái võng', difficulty: 'EASY' },
      { citizen: 'Máy ảnh', imposter_hint: 'Ống nhòm', difficulty: 'HARD' },
      { citizen: 'Bàn là', imposter_hint: 'Máy sấy', difficulty: 'HARD' },
      { citizen: 'Tủ lạnh', imposter_hint: 'Máy giặt', difficulty: 'EASY' },
      { citizen: 'Lò vi sóng', imposter_hint: 'Nồi cơm điện', difficulty: 'HARD' },
      { citizen: 'Quạt trần', imposter_hint: 'Điều hòa', difficulty: 'HARD' },
      { citizen: 'Bút bi', imposter_hint: 'Bút chì', difficulty: 'VERY_EASY' },
      { citizen: 'Thước kẻ', imposter_hint: 'Compa', difficulty: 'VERY_EASY' },
      { citizen: 'Ba lô', imposter_hint: 'Vali', difficulty: 'EASY' }
    ]
  },
  {
    id: 'sports',
    name: 'Thể thao',
    icon: '⚽',
    pairs: [
      { citizen: 'Bóng đá', imposter_hint: 'Bóng chuyền', difficulty: 'VERY_EASY' },
      { citizen: 'Bơi lội', imposter_hint: 'Lặn', difficulty: 'EASY' },
      { citizen: 'Cầu lông', imposter_hint: 'Tennis', difficulty: 'EASY' },
      { citizen: 'Bóng rổ', imposter_hint: 'Bóng ném', difficulty: 'EASY' },
      { citizen: 'Đạp xe', imposter_hint: 'Chạy bộ', difficulty: 'VERY_EASY' },
      { citizen: 'Võ thuật', imposter_hint: 'Boxing', difficulty: 'HARD' },
      { citizen: 'Cờ vua', imposter_hint: 'Cờ tướng', difficulty: 'HARD' },
      { citizen: 'Bắn cung', imposter_hint: 'Bắn súng', difficulty: 'HARD' },
      { citizen: 'Leo núi', imposter_hint: 'Điền kinh', difficulty: 'HARD' },
      { citizen: 'Trượt ván', imposter_hint: 'Trượt băng', difficulty: 'HARD' },
      { citizen: 'Nhảy cao', imposter_hint: 'Nhảy xa', difficulty: 'HARD' },
      { citizen: 'Chèo thuyền', imposter_hint: 'Lướt sóng', difficulty: 'HARD' },
      { citizen: 'Tập Gym', imposter_hint: 'Yoga', difficulty: 'EASY' },
      { citizen: 'Golf', imposter_hint: 'Bowling', difficulty: 'HARD' },
      { citizen: 'Bóng bàn', imposter_hint: 'Pickleball', difficulty: 'HARD' }
    ]
  }
];

const CATEGORY_VARIANTS = ['Co ban', 'Nang cao', 'Sieu toc'];

const expandCategoryPairs = (categories: Category[]): Category[] =>
  categories.map((category) => ({
    ...category,
    pairs: CATEGORY_VARIANTS.flatMap((variant) =>
      category.pairs.map((pair) => ({
        ...pair,
        citizen: `${pair.citizen} (${variant})`,
        imposter_hint: `${pair.imposter_hint} (${variant})`,
      }))
    ),
  }));

export const CATEGORIES: Category[] = expandCategoryPairs(BASE_CATEGORIES);
export const CHARADES_CATEGORIES: Category[] = expandCategoryPairs(BASE_CHARADES_CATEGORIES);
