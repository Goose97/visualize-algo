// const bubbleSort = `function swap(arr, firstIndex, secondIndex){
//     let temp = arr[firstIndex];
//     arr[firstIndex] = arr[secondIndex];
//     arr[secondIndex] = temp;
//   }

//   function bubbleSort(arr){

//     let len = arr.length,
//         i, j, stop;

//     for (i=0; i < len; i++){
//         for (j=0, stop=len-i; j < stop; j++){
//             if (arr[j] > arr[j+1]){
//                 swap(arr, j, j+1);
//             }
//         }
//     }

//     return arr;
//   }`;

const bubbleSort = `
def bubbleSort(arr): 
  n = len(arr) 

  # Traverse through all array elements 
  for i in range(n-1): 
  # range(n) also work but outer loop will repeat one time more than needed. 

    # Last i elements are already in place 
    for j in range(0, n-i-1): 

      # traverse the array from 0 to n-i-1 
      # Swap if the element found is greater 
      # than the next element 
      if arr[j] > arr[j+1] : 
          arr[j], arr[j+1] = arr[j+1], arr[j] 
`;

const selectionSort = `
def selection_sort(L):
  # i indicates how many items were sorted
  for i in range(len(L)-1):
      # To find the minimum value of the unsorted segment
      # We first assume that the first element is the lowest
      min_index = i
      # We then use j to loop through the remaining elements
      for j in range(i+1, len(L)-1):
          # Update the min_index if the element at j is lower than it
          if L[j] < L[min_index]:
              min_index = j
      # After finding the lowest item of the unsorted regions, swap with the first unsorted item
      L[i], L[min_index] = L[min_index], L[i]
`;

const insertionSort = `
def insertion_sort(array):
  # We start from 1 since the first element is trivially sorted
  for index in range(1, len(array)):
    currentValue = array[index]
    currentPosition = index

    # As long as we haven't reached the beginning and there is an element
    # in our sorted array larger than the one we're trying to insert - move
    # that element to the right
    while currentPosition > 0 and array[currentPosition - 1] > currentValue:
        array[currentPosition] = array[currentPosition -1]
        currentPosition = currentPosition - 1


    # We have either reached the beginning of the array or we have found
    # an element of the sorted array that is smaller than the element
    # we're trying to insert at index currentPosition - 1.
    # Either way - we insert the element at currentPosition
    array[currentPosition] = currentValue
`;

export const code = {
  bubbleSort: bubbleSort,
  selectionSort: selectionSort,
  insertionSort: insertionSort,
};

export const explanation = {
  bubbleSort: [
    'Duyệt mảng N lần (i = 0,1,..., N-1 (N = arr.length)).',
    'Lần duyệt thứ i đưa phần tử lớn thứ i về đúng vị trí N - i mảng.',
    'So sánh phần tử j hiện tại với phần tử  kế tiếp nó j+1',
    'Nếu phần thử hiện tại lớn hơn phẩn tử kế tiếp nó, đổi chỗ hai phần tử này',
    'Duyệt phần tử kế tiếp phần tử hiện tại',
  ],

  selectionSort: [
    'Duyệt mảng N lần (i = 0,1,..., N-1 (N = arr.length)).',
    'Lần duyệt thứ i đưa phần tử nhỏ thứ i về đúng vị trí i mảng. Khởi tạo min của dãy từ phần tử thứ i đến phần tử thứ N-1 là i',
    'Duyệt mảng từ phần tử  j bắt đầu từ vị trí thứ i+1 đến vị trí thứ N-1 để tìm min',
    'Nếu phần tử  j nhỏ hơn min, đặt min bằng phần tử  j',
    'Sau lần duyệt thứ i, nếu min không phải phần tử thứ i, đổi chỗ  min, i',
  ],
  insertionSort: [
    'Khởi tạo mảng với mảng con được sắp xếp với phần tử k = 1 (phần tử đầu tiên, phần tử có chỉ số 0)',
    'Duyệt từng phần tử từ phần tử thứ hai, tại mỗi phần tử chỉ mục i, nó được đặt ở một vị trí nhất định trong đoạn [0 ... i] sao cho dãy số từ [0 ... i] vẫn đảm bảo nhân vật của chuỗi tăng dần. Sau mỗi lần duyệt, số phần tử được sắp xếp k trong mảng tăng thêm 1.',
    'Lặp lại cho đến khi tất cả các yếu tố của mảng đã được duyệt.',
  ],
};
