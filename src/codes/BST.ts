import BST from 'types/ds/BST';

const searchCode = `function search(data) {
  let current = this.root;
  while (current !== null) {
    if (current.data === data) {
      // Found the element!
      return current;
    } else if (data < current.data) {
      // Go Left as data is smaller than parent
      current = current.left;
    } else {
      // Go right as data is greater than parent
      current = current.right;
    }
  }

  // Not found the element
  return null;
}`;

const insertCode = `function insert(value) {
  let newNode = new BinarySearchTreeNode(value); // { val: value, left: null, right: null }
  if (this.root === null) {
    this.root = newNode;
  } else {
    this.insertHelper(this.root, newNode);
  }
}

function insertHelper(currentNode, newNode) {
  // If the value is less than the current node value move left of the tree
  if (newNode.data < currentNode.data) {
    // If left is null insert node here
    if (currentNode.left === null) currentNode.left = newNode;
    // If left is not null recurr until null is found
    else insertHelper(currentNode.left, newNode);
  }
  // If the value is greater than the current node value move right of the tree
  else {
    // if right is null insert node here
    if (currentNode.right === null) currentNode.right = newNode;
    // if right is not null recurr until null is found
    else insertHelper(currentNode.right, newNode);
  }
}`;

const deleteCode = `function delete(value) {
  // Find node to delete
  let nodeToDelete = this.search(value);

  // If can't find node to delete, return root
  if (!nodeToDelete) return this.root;

  // If node has no child, just delete it
  // parent.left = null or parent.right = null

  // If node has one children, copy value of child then delete the child
  let onlyChild = nodeToDelete.left || nodeToDelete.right;
  nodeToDelete.val = onlyChild.val;
  if (nodeToDelete.left) nodeToDelete.left = null;
  else nodeToDelete.right = null;

  // If node has two children, find its predecessor (biggest node in the left subtree)
  // Copy its value then delete it
  let [predecessor, parentOfPredecessor] = this.findPredecessor(nodeToDelete);
  nodeToDelete.val = predecessor.delete;
  parentOfPredecessor.right = null;
}`;

const preorderCode = `
# A function to do preorder tree traversal 
def printPreorder(root): 
  
    if root: 
  
        # First print the data of node 
        print(root.val), 
  
        # Then recur on left child 
        printPreorder(root.left) 
  
        # Finally recur on right child 
        printPreorder(root.right) 

`;

const inorderCode = `
# A function to do inorder tree traversal 
def printInorder(root): 
  
    if root: 
  
        # First recur on left child 
        printInorder(root.left) 
  
        # then print the data of node 
        print(root.val), 
  
        # now recur on right child 
        printInorder(root.right) 

`;

const postoderCode = `
# A function to do postorder tree traversal 
def printPostorder(root): 
  
    if root: 
  
        # First recur on left child 
        printPostorder(root.left) 
  
        # the recur on right child 
        printPostorder(root.right) 
  
        # now print the data of node 
        print(root.val)
`;

export const code: Record<BST.Api, string> = {
  search: searchCode,
  insert: insertCode,
  delete: deleteCode,
  preorder: preorderCode,
  inorder: inorderCode,
  postorder: postoderCode,
};

export const explanation = {
  search: [
    'Khởi tạo biến lưu node hiện tại với giá trị ban đầu là root của binary search tree',
    'So sánh giá trị đang tìm kiếm với giá trị của node hiện tại',
    'Nếu bằng thì trả về node hiện tại',
    'Nếu nhỏ hơn thì đặt current = current.left (tiếp tục tìm kiếm ở bên trái)',
    'Nếu lớn hơn thì đặt current = current.right (tiếp tục tìm kiếm ở bên phải)',
    'Nếu kết thúc vòng loop mà vẫn chưa tìm thấy value thì trả về null',
  ],
  insert: [
    'Khởi tạo node mới và lưu vào biến newNode',
    'Nếu root chưa tồn tại thì đặt root là node mới tạo',
    'Nếu không thì đệ quy bắt đầu từ root để tìm vị trí insert',
    'Nếu giá trị cần insert nhỏ hơn giá node hiện tại thì insert nếu còn chỗ (currentNode.left === null), nếu không tiếp tục đệ quy với node con bên trái',
    'Nếu giá trị cần insert lớn hơn giá node hiện tại thì insert nếu còn chỗ (currentNode.right === null), nếu không tiếp tục đệ quy với node con bên phải',
  ],
  delete: [
    'Tìm kiếm node cần xoá',
    'Nếu node cần xoá không có children (là leaf node) thì chỉ cần xoá node đó đi',
    'Nếu node cần xoá có 1 children sao chép giá trị của child sang node cần xoá rồi xoá child đi',
    'Nếu node cần xoá có 2 children thì tìm node lớn nhất ở nhánh trái hoặc node nhỏ nhất của nhánh phải, sao chép giá trị sang node cần xoá rồi xoá node ấy',
  ],
  preorder: [
    'Duyệt tiền thứ tự cây con gốc A',
    'Nếu Cây là rỗng Return',
    'Thăm A',
    'Duyệt tiền thứ tự cây con gốc L',
    'Duyệt tiền thứ tự cây con gốc R',
  ],
  inorder: [
    'Duyệt trung thứ tự cây con gốc A',
    'Nếu Cây là rỗng Return',
    'Duyệt trung thứ tự cây con gốc L',
    'Thăm A',
    'Duyệt trung thứ tự cây con gốc R',
  ],
  postorder: [
    'Duyệt hậu thứ tự cây con gốc A',
    'Nếu Cây là rỗng Return',
    'Duyệt hậu thứ tự cây con gốc L',
    'Duyệt hậu thứ tự cây con gốc R',
    'Thăm A',
  ],
};
