import React, { CSSProperties, FunctionComponent } from 'react';
import styled from 'styled-components';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageClick: (page: number) => void;
  style?: CSSProperties;
  foreColor: string;
  backColor: string;
}

const Pagination: FunctionComponent<PaginationProps> = ({ page, totalPages, onPageClick, style, foreColor, backColor }) => {
  console.log('totalPages', totalPages);
  return (
    <div style={style}>
      <Container>
        {page !== 1 && (
          <SideButton
            onClick={() => onPageClick(page - 1)}
            type="button"
            foreColor={foreColor}
            backColor={backColor}
          >&lt;</SideButton>
        )}

        <PageButton
          onClick={() => onPageClick(1)}
          type="button"
          foreColor={foreColor}
          backColor={backColor}
          active={page === 1}
        >{1}</PageButton>

        {totalPages > 5 && page > 3 && (
          <Separator>...</Separator>
        )}

        {page === totalPages && totalPages > 3 && (
          <PageButton
            onClick={() => onPageClick(page - 2)}
            type="button"
            foreColor={foreColor}
            backColor={backColor}
          >{page - 2}</PageButton>
        )}

        {page > 2 && (
          <PageButton
            onClick={() => onPageClick(page - 1)}
            type="button"
            foreColor={foreColor}
            backColor={backColor}
          >{page - 1}</PageButton>
        )}

        {page !== 1 && page !== totalPages && (
          <PageButton
            onClick={() => onPageClick(page)}
            type="button"
            foreColor={foreColor}
            backColor={backColor}
            active
          >{page}</PageButton>
        )}

        {page < totalPages- 1 && (
          <PageButton
            onClick={() => onPageClick(page + 1)}
            type="button"
            foreColor={foreColor}
            backColor={backColor}
          >{page + 1}</PageButton>
        )}

        {page === 1 && totalPages > 3 && (
          <PageButton
            onClick={() => onPageClick(page + 2)}
            type="button"
            foreColor={foreColor}
            backColor={backColor}
          >{page + 2}</PageButton>
        )}

        {totalPages > 5 && page < totalPages - 2 && (
          <Separator>...</Separator>
        )}

        <PageButton
          onClick={() => onPageClick(totalPages)}
          type="button"
          foreColor={foreColor}
          backColor={backColor}
          active={page === totalPages}
        >{totalPages}</PageButton>

        {page !== totalPages && (
          <SideButton
            onClick={() => onPageClick(page + 1)}
            type="button"
            foreColor={foreColor}
            backColor={backColor}
          >&gt;</SideButton>
        )}
      </Container>
    </div>
  );
}

const Container = styled.div`
  padding: 2rem 0;
  display: flex;
  justify-content: center;
`;

interface PageButtonProps {
  foreColor: string;
  backColor: string;
  active?: boolean;
}

const PageButton = styled.button<PageButtonProps>`
  background: transparent;
  border: none;
  height: 2rem;
  width: 2rem;
  margin 0 0.25rem;
  border-radius: 50%;
  font-weight: 600;
  color: ${props => props.active ? props.backColor : props.foreColor};
  background-color: ${props => props.active ? props.foreColor : 'unset'};
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
  &:focus {
    outline: 0;
  }
`;

const SideButton = styled(PageButton)`
  box-shadow: transparent 0px 0px 0px 1px, transparent 0px 0px 0px 4px, rgba(0, 0, 0, 0.18) 0px 2px 4px;
  &:hover {
    text-decoration: none;
    box-shadow: transparent 0px 0px 0px 1px, transparent 0px 0px 0px 4px, rgba(0, 0, 0, 0.12) 0px 6px 16px;
  }
`;

const Separator = styled.div`
  width: 1rem;
  margin: 0 0.25rem;
`;

export default Pagination;
