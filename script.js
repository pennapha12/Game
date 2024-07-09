const canvas = document.getElementById('puzzleCanvas');
const ctx = canvas.getContext('2d');
const images = [
    { src: 'C:/jiksor_game/7R6A5961.jpg', title: 'ผศ.ดร.สุกัญญา เรืองสุวรรณ หัวหน้าสาขาวิชาสถิติ' },
    { src: 'C:/jiksor_game/7R6A5940.jpg', title: 'อ.ดร.จิตรจิรา ไชยฤทธิ์ อาจารย์ที่ปรึกษานักศึกษาวิชาเอกสถิติศาสตร์ ชั้นปีที่ 1' },
    { src: 'C:/jiksor_game/7R6A5926.jpg', title: 'ผศ.ดร.วรรณพร จันโทภาส ประธานวิชาเอกสถิติศาสตร์ อาจารย์ที่ปรึกษานักศึกษาวิชาเอกสถิติศาสตร์ ชั้นปีที่ 1' },
    { src: 'C:/jiksor_game/7R6A6044.jpg', title: 'รศ.ดร.วิชุดา ไชยศิวามงคล อาจารย์ที่ปรึกษานักศึกษาวิชาเอกสารสนเทศสถิติและวิทยาการข้อมูล ชั้นปีที่ 1' }
];

let currentImageIndex = 0;
let image = new Image();
let imageTitle = "";
let pieces = [];
const rows = 4;
const cols = 4;
let pieceWidth;
let pieceHeight;
let drawWidth;
let drawHeight;

image.onload = () => {
    // คำนวณขนาดที่เหมาะสมเพื่อคงอัตราส่วนเดิม
    const aspectRatio = image.width / image.height;
    drawWidth = canvas.width;
    drawHeight = canvas.height;

    if (canvas.width / canvas.height > aspectRatio) {
        drawWidth = canvas.height * aspectRatio;
    } else {
        drawHeight = canvas.width / aspectRatio;
    }

    // คำนวณตำแหน่งที่เหมาะสมเพื่อให้ภาพอยู่กึ่งกลาง
    const offsetX = (canvas.width - drawWidth) / 2;
    const offsetY = (canvas.height - drawHeight) / 2;

    // อัปเดตขนาดของชิ้นส่วนปริศนา
    pieceWidth = drawWidth / cols;
    pieceHeight = drawHeight / rows;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // ล้าง canvas ก่อนวาดภาพใหม่
    ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

    // สร้างชิ้นส่วนของปริศนา
    createPuzzlePieces(drawWidth, drawHeight, offsetX, offsetY);
};

function createPuzzlePieces(drawWidth, drawHeight, offsetX, offsetY) {
    pieces = [];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const sx = col * pieceWidth * (image.width / drawWidth);
            const sy = row * pieceHeight * (image.height / drawHeight);
            const dx = col * pieceWidth;
            const dy = row * pieceHeight;
            const index = row * cols + col;
            pieces.push({ sx, sy, dx, dy, index, revealed: false });
        }
    }
    drawPuzzle();
}

function loadNextImage() {
    currentImageIndex++;
    if (currentImageIndex >= images.length) {
        currentImageIndex = 0; // reset to the first image if at the end
    }
    resetPuzzle();
}

function resetPuzzle() {
    pieces = [];
    image.src = images[currentImageIndex].src;
    imageTitle = images[currentImageIndex].title;
}

function drawPuzzle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(piece => {
        if (piece.revealed) {
            ctx.drawImage(
                image,
                piece.sx, piece.sy, pieceWidth * (image.width / drawWidth), pieceHeight * (image.height / drawHeight),
                piece.dx, piece.dy, pieceWidth, pieceHeight
            );
        } else {
            ctx.fillStyle = 'gray';
            ctx.fillRect(piece.dx, piece.dy, pieceWidth, pieceHeight);
            ctx.strokeStyle = 'black';
            ctx.strokeRect(piece.dx, piece.dy, pieceWidth, pieceHeight);
            ctx.font = '20px Arial';
            ctx.fillStyle = 'red';
            ctx.fillText(piece.index, piece.dx + 10, piece.dy + 30);
        }
    });
}

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    pieces.forEach(piece => {
        if (!piece.revealed && x >= piece.dx && x <= piece.dx + pieceWidth && y >= piece.dy && y <= piece.dy + pieceHeight) {
            piece.revealed = true;
            drawPuzzle();
            if (pieces.every(p => p.revealed)) {
                document.getElementById('solutionImage').src = image.src;
                document.getElementById('imageTitle').textContent = imageTitle;
                document.getElementById('solution').style.display = 'block';
                document.getElementById('nextImage').style.display = 'block';
            }
        }
    });
});

document.getElementById('revealAll').addEventListener('click', () => {
    pieces.forEach(piece => piece.revealed = true);
    drawPuzzle();

    // Set solution image source and adjust size
    document.getElementById('solutionImage').src = image.src;
    document.getElementById('solutionImage').style.width = '80%';
    document.getElementById('solutionImage').style.height = 'auto';

    // Set image title
    document.getElementById('imageTitle').textContent = imageTitle;

    // Display solution and next image button
    document.getElementById('solution').style.display = 'block';
    document.getElementById('nextImage').style.display = 'block';
});

document.getElementById('nextImage').addEventListener('click', () => {
    document.getElementById('solution').style.display = 'none';
    document.getElementById('nextImage').style.display = 'none';
    loadNextImage();
});

document.getElementById('loadImage').addEventListener('click', () => {
    const selectedIndex = document.getElementById('imageSelector').value;
    currentImageIndex = parseInt(selectedIndex, 10);
    resetPuzzle();
    image.onload(); // เรียกใช้งาน onload เพื่อวาดภาพใหม่
});

resetPuzzle();
